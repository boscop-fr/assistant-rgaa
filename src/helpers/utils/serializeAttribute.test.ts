import {describe, expect, test} from 'vitest';
import serializeAttribute from './serializeAttribute';

describe('serializeAttribute', () => {
	test('should escape ids taken from the page', () => {
		const input = document.createElement('input');
		input.setAttribute('aria-describedby', '<img src=x onerror=alert(1)>');

		const container = document.createElement('div');
		container.innerHTML =
			serializeAttribute(input, 'aria-describedby', false) ?? '';

		expect(container.querySelector('img')).toBeNull();
		expect(container.textContent).toContain('<img');
	});
});
