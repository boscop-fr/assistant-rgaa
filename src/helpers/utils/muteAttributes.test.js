/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import {muteAttribute, restoreAttribute, restoreAllAttributes} from './muteAttributes';

describe('muteAttributes', function() {
	describe('muteAttribute', function() {
		it('should restore an attribute', function() {
			const p = $('<p style="width: 100px">test</p>');

			muteAttribute(p, 'style');

			expect(p.attr('style')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted')).toBe('style');
			expect(p.attr('data-rgaa-ext-muted-style')).toBe('width: 100px');
		});
	});

	describe('restoreAttribute', function() {
		it('should restore an attribute', function() {
			const p = $('<p style="width: 100px">test</p>');

			muteAttribute(p, 'style');
			restoreAttribute(p, 'style');

			expect(p.attr('style')).toBe('width: 100px');
			expect(p.attr('data-rgaa-ext-muted')).toBeUndefined();
			expect(p.attr('data-rgaa-ext-muted-style')).toBeUndefined();
		});
	});

	describe('restoreAllAttributes', function() {
		it('should restore all muted attributes', function() {
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
