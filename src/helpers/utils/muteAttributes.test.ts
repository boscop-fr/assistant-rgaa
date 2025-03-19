import {describe, expect, test} from '@jest/globals';
import {
	muteAttribute,
	restoreAllAttributes,
	restoreAttribute
} from './muteAttributes';

describe('muteAttributes', () => {
	describe('muteAttribute', () => {
		test('should restore an attribute', () => {
			const p = document.createElement('p');
			p.style.width = '100px';

			muteAttribute([p], 'style');

			expect(p.getAttribute('style')).toBeNull();
			expect(p.getAttribute('data-rgaa-ext-muted')).toBe('style');
			expect(p.getAttribute('data-rgaa-ext-muted-style')).toBe('width: 100px;');
		});
	});

	describe('restoreAttribute', () => {
		test('should restore an attribute', () => {
			const p = document.createElement('p');
			p.style.width = '100px';

			muteAttribute([p], 'style');
			restoreAttribute([p], 'style');

			expect(p.getAttribute('style')).toBe('width: 100px;');
			expect(p.getAttribute('data-rgaa-ext-muted')).toBeNull();
			expect(p.getAttribute('data-rgaa-ext-muted-style')).toBeNull();
		});
	});

	describe('restoreAllAttributes', () => {
		test('should restore all muted attributes', () => {
			const p = document.createElement('p');
			p.style.width = '100px';
			p.lang = 'en';

			muteAttribute([p], 'lang');
			muteAttribute([p], 'style');
			restoreAllAttributes([p]);

			expect(p.getAttribute('lang')).toBe('en');
			expect(p.getAttribute('style')).toBe('width: 100px;');
			expect(p.getAttribute('data-rgaa-ext-muted')).toBeNull();
			expect(p.getAttribute('data-rgaa-ext-muted-lang')).toBeNull();
			expect(p.getAttribute('data-rgaa-ext-muted-style')).toBeNull();
		});
	});
});
