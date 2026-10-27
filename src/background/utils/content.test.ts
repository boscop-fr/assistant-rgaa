import {beforeEach, describe, expect, test, vi} from 'vitest';

// Simulates the isolated world of a single tab.
let world: {rgaaExt?: boolean} = {};

type Injection = {func?: () => unknown; files?: string[]};

// Hoisted along with `vi.mock()`, which uses them.
const {executeScript, insertCSS} = vi.hoisted(() => ({
	executeScript: vi.fn(async ({func, files}: Injection) => {
		if (files) {
			return [];
		}

		const previous = globalThis.rgaaExt;
		globalThis.rgaaExt = world.rgaaExt;
		const result = func();
		world.rgaaExt = globalThis.rgaaExt;
		globalThis.rgaaExt = previous;
		return [{result}];
	}),
	insertCSS: vi.fn(async () => {})
}));

vi.mock('webextension-polyfill', () => ({
	default: {scripting: {executeScript, insertCSS}}
}));

import {injectContentScripts} from './content';

const injectedFiles = () =>
	executeScript.mock.calls.filter(([{files}]) => files).length;

describe('injectContentScripts', () => {
	beforeEach(() => {
		world = {};
		executeScript.mockClear();
	});

	test('should inject scripts once for concurrent calls', async () => {
		await Promise.all([injectContentScripts(1), injectContentScripts(1)]);
		await injectContentScripts(1);

		expect(injectedFiles()).toBe(1);
	});

	test('should allow injecting again after a failure', async () => {
		insertCSS.mockRejectedValueOnce(new Error('Cannot access page'));

		await expect(injectContentScripts(1)).rejects.toThrow();
		await injectContentScripts(1);

		expect(injectedFiles()).toBe(2);
	});
});
