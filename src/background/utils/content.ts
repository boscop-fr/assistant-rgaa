import {browser} from '../../common/utils/webExtension';

const CONTENT_SCRIPTS = ['dist/helpers.js', 'dist/minimap.js'];
const CONTENT_STYLES = ['dist/helpers.css'];

declare global {
	var rgaaExt: boolean | undefined;
}

// Marks scripts as injected, and tells if they already
// were. Both are done at once so concurrent calls can't both
// see unmarked scripts. This runs in the extension's
// isolated world, where content scripts run, so the page
// can't tamper with the flag.
const markScriptsInjected = async (tabId: number) => {
	const results = await browser.scripting.executeScript({
		target: {tabId},
		func: () => {
			const injected = !!globalThis.rgaaExt;
			globalThis.rgaaExt = true;
			return injected;
		}
	});

	return results?.[0]?.result;
};

const unmarkScriptsInjected = (tabId: number) =>
	browser.scripting.executeScript({
		target: {tabId},
		func: () => {
			globalThis.rgaaExt = false;
		}
	});

const injectOnce = async (tabId: number) => {
	if (await markScriptsInjected(tabId)) {
		return;
	}

	try {
		await Promise.all([
			browser.scripting.insertCSS({
				target: {tabId},
				files: CONTENT_STYLES
			}),
			browser.scripting.executeScript({
				target: {tabId},
				files: CONTENT_SCRIPTS
			})
		]);
	} catch (e) {
		// Allows another attempt.
		await unmarkScriptsInjected(tabId).catch(() => {});
		throw e;
	}
};

// Injections in progress, so concurrent calls for a tab
// wait for the same injection to complete.
const injections = new Map<number, Promise<void>>();

export const injectContentScripts = (tabId: number) => {
	let injection = injections.get(tabId);

	if (!injection) {
		injection = injectOnce(tabId).finally(() => {
			injections.delete(tabId);
		});

		injections.set(tabId, injection);
	}

	return injection;
};
