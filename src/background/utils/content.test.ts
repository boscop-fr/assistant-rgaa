import {beforeEach, describe, expect, jest, test} from '@jest/globals';

// Simulates the isolated world of a single tab.
let world: {rgaaExt?: boolean} = {};

type Injection = {func?: () => unknown; files?: string[]};

const executeScript = jest.fn(async ({func, files}: Injection) => {
	if (files) {
		return [];
	}

	const previous = globalThis.rgaaExt;
	globalThis.rgaaExt = world.rgaaExt;
	const result = func();
	world.rgaaExt = globalThis.rgaaExt;
	globalThis.rgaaExt = previous;
	return [{result}];
});

const insertCSS = jest.fn(async () => {});

jest.mock('webextension-polyfill', () => ({
	__esModule: true,
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
