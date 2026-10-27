# Architecture review

Working document: findings from an architecture review (2026-10-27), used as a
plan when refactoring. Tick items as they are done, and update the notes when
reality differs from what is written here.

Findings use ids (`M1`, `H2`…) so commits and PRs can reference them.

## Overall shape

| Part         | Runs in                       | Role                                                                   |
| ------------ | ----------------------------- | ---------------------------------------------------------------------- |
| `background` | service worker / event page   | Opens the sidebar, injects scripts, privileged tasks (capture, fetch…) |
| `panel`      | sidebar or popup              | Redux app: reference, audit results, enabled tests                     |
| `helpers`    | content script (audited page) | Applies and reverts changes to the page                                |
| `minimap`    | page (custom element, shadow) | Overview of highlighted elements                                       |
| `options`    | options page                  | Settings in `storage.local`                                            |

Keep:

- Reference data as JSON per RGAA version, loaded with dynamic `import()`.
- The panel as the single source of truth, the page as an executor.
- Effects that return their own revert, composed with `combineEffects`.
- Re-applying the whole set of helpers on each change (revert all, apply all).
- The shadow DOM minimap.

Main problem: module boundaries are only folders. `helpers` imports
`panel/slices` and `panel/utils/hooks`, `panel` imports `helpers`, and
`background/slices/runtime.ts` is imported by everyone. There is no shared
protocol module.

## Suggested order

1. Safety net: [T1](#t1), [T2](#t2), [T3](#t3), [D1](#d1).
2. Messaging over ports: [M1](#m1) to [M5](#m5).
3. Helpers split: [H1](#h1) to [H5](#h5) (best done together with step 2).
4. Panel state cleanups: [S1](#s1) to [S3](#s3).
5. Dependency swaps: [D2](#d2) to [D6](#d6).

---

## Messaging

### Current flow

Messages are Redux actions (`createAction`), checked with `.match()`. That is
fine and should stay. The transport is the problem: almost everything is a
`runtime.sendMessage` broadcast to all extension pages.

```
panel ──tabs.sendMessage──▶ content script          (applyHelpers, requestPixelColor, getHierarchy)
content ──runtime.sendMessage──▶ ALL extension pages (updateColor, setHierarchy, helpersReady)
          └▶ background re-broadcasts it as tabAction{tabId, action} ──▶ ALL extension pages
panel filters tabAction by tabId (useTabAction, listeners/helpers.ts)
```

### Target

One port per panel ↔ tab:

```ts
// panel
const port = browser.tabs.connect(tabId, {name: 'panel'});
port.postMessage(applyHelpers(helpers));
port.onMessage.addListener((action) => store.dispatch(action));

// content script
browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(handle);
  port.onDisconnect.addListener(revertActiveHelpers);
});
```

The background keeps only privileged jobs: capture, fetch sources, create tabs,
inject scripts.

### History: why ports were dropped

Ports were used before, and removed in `4307872` (2025-03-08, "Fixed detection
of panel closing"):

- The panel opened `runtime.connect()` to the **background**, and the background
  used `port.onDisconnect` to detect the panel closing
  ([stackoverflow.com/a/77106777](https://stackoverflow.com/a/77106777/2391359)).
- Since the MV3 migration (`35d9a85`, 2023), the background is a service worker,
  which the browser can stop at any time. Stopping it closes the port, so
  `onDisconnect` fired while the panel was still open, and helpers were
  reverted. A keepalive (`keepRuntimeConnectionAlive`, a ping every 5 s with
  reconnection) tried to work around it.
- It was replaced by `visibilitychange` in the panel. Then `a0682b8`
  (2025-03-09) introduced the `tabAction` relay, so messages from a tab reach
  the right panel (before, the background forwarded them to "the current tab").

The target above is different: the port links the **panel page** and the
**content script** directly (`tabs.connect`), and the service worker is not part
of it. Its lifetime does not apply. This port closes when one of its ends goes
away:

- the panel page closes or reloads: the intended signal;
- the audited page navigates or reloads: the panel must reconnect after scripts
  are injected again (where `onTabMount` already reloads the state);
- the audited page enters the back/forward cache: Chrome closes ports to cached
  pages, so the panel must reconnect when the page is shown again.

To check with a prototype before committing to it, in Chrome and Firefox:

- [ ] Port stays open with the panel idle for more than 5 minutes (service
      worker stopped meanwhile, check in `chrome://serviceworker-internals`).
- [ ] `onDisconnect` fires in the content script when the panel is closed:
      Chrome side panel, Firefox sidebar, and the popup window.
- [ ] Chrome per-tab side panel: when switching tabs, is the hidden panel's page
      kept alive (port stays open, helpers stay applied on the other tab) or
      unloaded? Decide which behavior is wanted.
- [ ] Reconnection after reload, navigation and back/forward cache.

One-shot requests to the background (`captureCurrentTab`, `createTab`…) are not
affected: a message wakes the service worker up.

### M1 - Request/response built from two broadcasts {#m1}

- [x] Done

  Color and style picking, and headings hierarchy requests, are answered through
  the return value of `tabs.sendMessage`. Content script listeners must only
  return a promise for the messages they handle: the first promise answers
  (covered by an e2e test). Headings updates are still pushed by broadcast until
  M2, including one when the helper is applied, as the panel may request the
  hierarchy before that.

- Where: [ColorContrast.tsx](../src/helpers/components/ColorContrast.tsx)
  (`usePicker`, comment "This whole thing is VERY obscure"),
  [colorContrast.ts](../src/helpers/helpers/colorContrast.ts),
  [HeadingsHierarchy.tsx](../src/helpers/components/HeadingsHierarchy.tsx),
  [headingsHierarchy.ts](../src/helpers/helpers/headingsHierarchy.ts).
- Problem: picking a color sends `requestPixelColor`, then the page broadcasts
  `updateColor`, the background relays it, and the component filters by tab and
  matches it to the request through its state.
- Target: `const color = await request(requestPixelColor())` over the port (or
  `tabs.sendMessage` returning the listener's value, as `captureCurrentTab`
  already does). Headings hierarchy pushes updates through the same port.

### M2 - Broadcasts reach every extension page {#m2}

- [x] Done

  The panel connects with `tabs.connect()` once `appLoaded` answers (the
  background answers when scripts are injected), then sends helpers over the
  port. The page pushes headings updates through it. The `helpersReady`
  broadcast sent by the page on load is gone: connecting is the signal. Port
  handling lives in [panel/utils/port.ts](../src/panel/utils/port.ts) and
  [helpers/utils/panel.ts](../src/helpers/utils/panel.ts). Injection failures
  (browser pages) are logged without failing the tab loading.

- Where: every `browser.runtime.sendMessage` from content scripts and the
  background.
- Problem: side panels of other tabs, the popup and the view source page all
  receive everything, and must defend themselves (bug fixed in `21d3727`: the
  source page showed `[object Object]`).
- Target: the port carries panel ↔ tab traffic. Nothing tab-specific is
  broadcast.

### M3 - Generic relay in the background {#m3}

- [x] Done

  The relay, `tabAction` and `useTabAction` are deleted. `helpersReady` is now
  only dispatched inside the panel, but still lives in
  [runtime.ts](../src/background/slices/runtime.ts): move it with S1.

- Where: [background/index.ts](../src/background/index.ts) (case
  `isAction(message) && !!sender?.tab?.id`), `tabAction` in
  [runtime.ts](../src/background/slices/runtime.ts),
  [hooks.ts](../src/helpers/utils/hooks.ts) (`useTabAction`), the first listener
  in [listeners/helpers.ts](../src/panel/listeners/helpers.ts).
- Problem: forwards any action from any tab, only to attach a tab id.
- Target: delete the relay, `tabAction` and `useTabAction`. The port knows its
  tab.

### M4 - No panel lifecycle {#m4}

- [x] Done

  The page reverts helpers when the port of its current panel disconnects. The
  panel no longer reverts and re-applies helpers on `visibilitychange`
  (decision: helpers stay applied as long as the tab's panel is alive). Saving
  the state when the panel is hidden is kept. The prototype checks in
  [History: why ports were dropped](#history-why-ports-were-dropped) are still
  to be done manually.

- Where: `visibilitychange` listeners in
  [listeners/helpers.ts](../src/panel/listeners/helpers.ts) and
  [listeners/storage.ts](../src/panel/listeners/storage.ts).
- Problem: there is no "panel closed" event, so helpers are reverted when the
  panel is hidden and re-applied when shown. Every tab switch costs a full
  revert and re-apply, and the page stays modified if the panel dies without
  becoming hidden.
- Target: `port.onDisconnect` in the content script reverts helpers. This is
  what `4307872` gave up on with a port to the service worker; a port to the
  content script avoids that problem, but must pass the prototype checks in
  [History: why ports were dropped](#history-why-ports-were-dropped) first.
  Check whether Firefox still needs the tab-switch handling, as its sidebar
  instance stays alive across tabs (see `reloadSidebar` in
  [sidebar.ts](../src/background/utils/sidebar.ts)). Saving on hide (storage
  listener) can stay.

### M5 - Script injection check in the wrong world {#m5}

- [x] Done

  Kept the flag rather than probing with `tabs.connect`, moved to the isolated
  world, and read and set in a single `executeScript`. The flag is cleared if
  injection fails, so it can be retried. Concurrent calls for a tab share the
  injection in progress, so none answers before scripts are loaded (unit tested
  in [content.test.ts](../src/background/utils/content.test.ts)).

- Where: [content.ts](../src/background/utils/content.ts).
- Problem: the `rgaaExt` flag is read and written in the `MAIN` world, while the
  scripts run in the isolated world. The page can spoof it or collide with it,
  and check-then-inject races when two `appLoaded` arrive together.
- Target: with ports, try `tabs.connect` first and inject only if it fails, or
  keep the flag in the isolated world.

### M6 - `pollEffect` used as a startup hook {#m6}

- [x] Done

  `pollEffect` is deleted. Browser events are subscribed to in
  [subscriptions.ts](../src/panel/subscriptions.ts), called once the store is
  created. The version switch is now the `switchReferenceVersion` thunk. The
  auto save keeps `predicate: () => true`, as it does react to every action.

- Where: [utils/listeners.ts](../src/panel/utils/listeners.ts), used with
  `predicate: () => true` in `listeners/*.ts`.
- Problem: works, but turns the listener middleware into "subscribe to a browser
  event at startup", which readers must decode.
- Target: subscribe to browser events once when the store is created (plain
  functions taking `store`), keep the listener middleware for reactions to
  actions. Most of these subscriptions go away with M1 to M4.

---

## Helpers

Today a helper is one object
`{name, defaultOptions, describe, component?, apply?}`
([types.ts](../src/helpers/types.ts)). `apply(options)` returns an `Effect`: a
function changing the page and returning its revert.

### H1 - One module, two runtimes {#h1}

- [x] Done: option types and defaults in [types.ts](../src/helpers/types.ts),
      effects in [src/helpers/helpers/](../src/helpers/helpers/), descriptions
      and widgets in [src/panel/helpers/](../src/panel/helpers/).
      `dist/helpers.js` went from 85 KB to 30 KB. `applyHelpers` /
      `revertActiveHelpers` moved to
      [helpers/slices/helpers.ts](../src/helpers/slices/helpers.ts) (part of
      S1). RTK's `createAction` and `isAction` (1.2 KB) are still bundled
      through the shared messages; dropping them means replacing `createAction`
      for messages. `createHelper` is gone, each helper is typed by its own
      options (part of H4).

- Where: every file in [src/helpers/helpers/](../src/helpers/helpers/).
- Problem: `describe` and `component` run in the panel, `apply` in the page.
  Bundled together, the content script injected in every audited page ships the
  panel stack: the `dist/helpers.js` source map (85 KB) contains `react-intl`,
  `react-redux`, `@reduxjs/toolkit`, `immer`, `lucide-react`. It is also why
  `helpers/` imports from `panel/`.
- Target: shared option types and names in one place, two registries joined by
  helper name:
  - page side, e.g. `src/helpers/apply/*.ts`: effects only, no UI;
  - panel side, e.g. `src/panel/helpers/*.tsx`: `describe` and `component`.
- Done when: `dist/helpers.js` no longer contains preact, react-intl or redux,
  and nothing in `src/helpers` imports `src/panel`.

### H2 - Hidden global between highlight effects {#h2}

- [x] Done: `outline`, `showAttributes`, `showElement` and `showChildElements`
      return a `Highlight` descriptor, from their own registry in
      [helpers/index.ts](../src/helpers/helpers/index.ts).
      `highlightElementsEffect(highlights)` merges them per element and target
      (fixing the `@todo` collision) and renders them. `HighlightOptions` is
      gone. An invalid selector is logged and skipped instead of breaking every
      helper.

- Where: [highlight.ts](../src/helpers/effects/highlight.ts)
  (`optionsByElement`, `@todo` about key collisions),
  [helpers.ts](../src/helpers/utils/helpers.ts) (adds
  `highlightElementsEffect()` last), `outline`, `showAttributes`, `showElement`,
  `showChildElements`.
- Problem: those helpers' `apply` only register options in a module-level `Map`,
  with a no-op revert. `highlightElementsEffect` renders them later. Correctness
  depends on effect order and on a global.
- Target: those helpers return descriptors (`{selector, showTag, attributes…}`),
  a single renderer merges and renders them. They become pure functions,
  testable without a DOM render.

### H3 - Three kinds of helpers behind one shape {#h3}

- [x] Done: each helper's kind (effect, service, highlight, tool) is declared
      with its options in [types.ts](../src/helpers/types.ts). The page
      registries in [helpers/index.ts](../src/helpers/helpers/index.ts) are
      checked with `satisfies` to hold every helper of their kinds, so a
      forgotten or misplaced helper is a type error instead of a silent no-op.
      Services still listen to `runtime.onMessage` while applied, as M1 kept
      requests on `tabs.sendMessage` rather than the port.

- Where: `colorContrast`, `headingsHierarchy` (services: they install message
  listeners), `viewSource`, `validateLocalPage`, `externalTool` (panel-only
  buttons, no `apply`), the others (page effects).
- Problem: the difference is implicit (whether `apply` exists, what it does). A
  missing `apply` crashed all helpers (fixed in `fcb45a7`).
- Target: make the kind explicit in the registries from H1 (effect, service,
  tool). Services become port request handlers (M1).

### H4 - Helper typing is mostly unchecked {#h4}

- [x] Done: mostly by H1. `createHelper`, `helperInfo` and the `as XOptions`
      casts are gone; defaults are checked against `Partial<HelperOptions<N>>`,
      and each effect, highlight and description gets its own helper's options.
      One cast remains in `helperOptions` (merging defaults with the options of
      a generic helper). Options having a default are still typed as optional,
      which only matters once `strictNullChecks` is on (T1); destructuring
      defaults duplicating them were removed.

- Where: [types.ts](../src/helpers/types.ts),
  [createHelper.ts](../src/helpers/utils/createHelper.ts), every helper's
  `defaultOptions`.
- Problems:
  - `defaultOptions: {...} as XOptions` disables checking of defaults;
  - `createHelper<const N, O>` doesn't constrain `O` (current `tsc` error);
  - `helperInfo` casts args to `UnionToIntersection<all options>`, so inside a
    module options are effectively unchecked.
- Keep: `Helper` derived from the modules map as a union keyed by `helper`.
- Target: each helper typed by its own options (easier once H1 splits them), no
  casts on defaults, `O extends HelperOptions`.

### H5 - Outdated helpers documentation {#h5}

- [ ] Done

- Where: [doc/helpers.md](helpers.md).
- Problem: describes `apply(id)` / `revert(id)`, which no longer exist.
- Target: describe the current (or post-H1) model.

---

## Type safety and tests

### T1 - TypeScript is never run {#t1}

- [ ] Done

- Where: [package.json](../package.json) scripts,
  [quality.yml](../.github/workflows/quality.yml),
  [tsconfig.json](../tsconfig.json).
- Problem: rspack compiles with swc, which strips types without checking them.
  `tsc --noEmit` reports errors today (around 7), partly from `@types/react-dom`
  18 clashing with preact. `strict` is off.
- Target: `tsc --noEmit` in `lint`, errors fixed, then enable `strictNullChecks`
  progressively (the editor already flags nulls in `colorContrast.ts`,
  `serializeAttribute.ts`).

### T2 - Helpers mapping JSON never validated {#t2}

- [ ] Done

- Where: [data/helpers/](../data/helpers/), cast `as HelpersByTest` in
  [panel/utils/helpers.ts](../src/panel/utils/helpers.ts).
- Problem: a typo in a helper name or a missing required option is only found at
  runtime, in the audited page.
- Target: a unit test loading every `data/helpers/*.json` and checking each
  entry against the helper modules (name exists, required options present).

### T3 - Jest + jsdom friction {#t3}

- [ ] Done

- Where: [jest.config.js](../jest.config.js), 4 small test files.
- Problem: four dependencies (`jest`, `ts-jest`, `jest-environment-jsdom`,
  `@jest/globals`) for a handful of tests, and jsdom gaps blocked tests
  (`CSSStyleSheet.disabled`, escaped id selectors).
- Target: Vitest (one dependency, native TS), or Jest 30 if staying.

---

## Panel state

### S1 - Empty reducers used as action creators {#s1}

- [ ] Done

- Where: `toggleCriterion` ([criteria.ts](../src/panel/slices/criteria.ts)),
  `togglePopup` ([panel.ts](../src/panel/slices/panel.ts)), `applyHelpers` and
  `revertActiveHelpers` ([helpers.ts](../src/panel/slices/helpers.ts)).
- Target: `createAction`. `applyHelpers` / `revertActiveHelpers` are protocol
  messages and belong in the shared protocol module (with M1).

### S2 - Auto save on every action {#s2}

- [ ] Done

- Where: [listeners/storage.ts](../src/panel/listeners/storage.ts).
- Problem: saves after any non-`storage/*` action, gated by `isLoading`. Two
  save bugs came from this (`4c86f22`, `26c7ac9`).
- Target: save on a whitelist of slices that are persisted (`audit`, `tests`,
  `criteria`, `themes`), matching `SKIPPED_SLICES` in
  [slices/storage.ts](../src/panel/slices/storage.ts).

### S3 - `isLoading` only blocks saving {#s3}

- [ ] Done

- Where: [slices/app.ts](../src/panel/slices/app.ts).
- Problem: the UI never shows it, its only role is preventing saves.
- Target: rename it to what it means, or show a loading state.

---

## Dependencies

Versions from `npm outdated` on 2026-10-27.

### D1 - Safe updates {#d1}

- [ ] Done

- Patch/minor, low risk: `@reduxjs/toolkit` 2.6 → 2.13, `react-redux` 9.3,
  `preact` 10.29, `preact-custom-element` 4.6, `color-string` 2.1, `css-loader`
  7.1.5, `prettier` 3.9, `ts-jest` 29.4, `@playwright/test` 1.64,
  `@types/webextension-polyfill` 0.12.6, `typescript` 5.9, `@rspack/*` 1.7.
- `@biomejs/biome` 1.9 → 2.x: run `biome migrate` on
  [biome.json](../biome.json).
- `web-ext` 8 → 10.
- Remove `@types/react-dom` (wrong with preact, causes `tsc` errors).
- Move `@rspack/core` to devDependencies, `color-string` and `wcag-contrast` to
  dependencies (they are bundled at runtime).
- Node: volta pins 20.0.0 (end of life since April 2026) while CI uses `lts/*`.
  Pin 22 or 24 in both.

### D2 - Drop `webextension-polyfill` {#d2}

- [ ] Done

- Chrome MV3 APIs return promises, Firefox has `browser`.
  [pages/\*.js](../pages/) already use
  `typeof browser === 'undefined' ? chrome : browser`.
- Check first: the background `onMessage` listener returns a promise for
  `captureCurrentTab`. Chrome historically needed `sendResponse` +
  `return true`, which the polyfill bridges. Do it after M1 (ports or explicit
  `sendResponse` avoid the issue).

### D3 - Native color handling {#d3}

- [ ] Done

- `wcag-contrast`: about 15 lines of formula, can be inlined in
  [color.ts](../src/common/utils/color.ts).
- `color-string`: `CSS.supports('color', c)` to validate, a 1×1 canvas
  `fillStyle` to normalize to hex.

### D4 - Small dependencies {#d4}

- [ ] Done

- `commander`: only `bin/fix` and `bin/format`, `node:util` `parseArgs` does the
  job.
- `debounce` (2 uses): keep, or 5 lines.
- `classnames`: fine as is.

### D5 - Majors to plan {#d5}

- [ ] Done

- `react-intl` 7 → 12: the biggest runtime dependency, for one locale. ICU
  messages (select/plural) justify keeping it. Leaves the content script with
  H1.
- `lucide-react` 0.482 → 1.x: check renamed icons.
- `@rspack/*` 2.x, `preact` 11 (check `preact/compat` aliasing and
  `preact-custom-element`), `typescript` 7 (native rewrite): wait for tooling to
  settle.

### D6 - Test runner {#d6}

- [ ] Done

- See [T3](#t3).

---

## Not reviewed

- Panel UI components in detail, the options form, the minimap rendering beyond
  its hooks.
- Bundle contents come from the `dist/helpers.js` source map, not a bundle
  analyzer.
