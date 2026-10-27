import {describe, expect, test} from '@jest/globals';
import {toggleStyleSheetsEffect} from './dom';

describe('toggleStyleSheetsEffect', () => {
	test('should restore the previous state of each style sheet', () => {
		document.head.innerHTML = '<style>p {}</style><style>a {}</style>';
		const [enabled, disabled] = Array.from(document.styleSheets);
		// jsdom leaves `disabled` undefined, unlike browsers.
		enabled.disabled = false;
		disabled.disabled = true;

		const revert = toggleStyleSheetsEffect(false)();
		expect(enabled.disabled).toBe(true);
		expect(disabled.disabled).toBe(true);

		revert();
		expect(enabled.disabled).toBe(false);
		expect(disabled.disabled).toBe(true);
	});
});
