import {describe, expect, test} from '@jest/globals';
import $ from 'jquery';
import {
	muteAttribute,
	restoreAllAttributes,
	restoreAttribute
} from './muteAttributes';

describe('muteAttributes', function () {
	describe('muteAttribute', function () {
		test('should restore an attribute', function () {
			const p = $('<p style="width: 100px">test</p>');

			muteAttribute(p, 'style');

			expect(p.attr('style')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted')).toBe('style');
			expect(p.attr('data-rgaa-ext-muted-style')).toBe('width: 100px');
		});
	});

	describe('restoreAttribute', function () {
		test('should restore an attribute', function () {
			const p = $('<p style="width: 100px">test</p>');

			muteAttribute(p, 'style');
			restoreAttribute(p, 'style');

			expect(p.attr('style')).toBe('width: 100px');
			expect(p.attr('data-rgaa-ext-muted')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted-style')).toBeUndefined();
		});
	});

	describe('restoreAllAttributes', function () {
		test('should restore all muted attributes', function () {
			const p = $('<p lang="en" style="width: 100px">test</p>');

			muteAttribute(p, 'lang');
			muteAttribute(p, 'style');
			restoreAllAttributes(p);

			expect(p.attr('lang')).toBe('en');
			expect(p.attr('style')).toBe('width: 100px');
			expect(p.attr('data-rgaa-ext-muted')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted-lang')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted-style')).toBeUndefined();
		});
	});
});
