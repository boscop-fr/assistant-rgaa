import {describe, expect, test, vi} from 'vitest';
import {highlightElementsEffect, mergeDisplays} from './highlight';

describe('mergeDisplays', () => {
	test('shows everything any display asks for', () => {
		expect(
			mergeDisplays(
				{tag: true, attributes: ['a', 'b'], missingAttributes: ['b']},
				{outline: true, attributes: ['b', 'c'], missingAttributes: ['c']}
			)
		).toStrictEqual({
			outline: true,
			tag: true,
			ifEmpty: undefined,
			content: undefined,
			attributes: ['a', 'b', 'c'],
			missingAttributes: ['b', 'c']
		});
	});
});

describe('highlightElementsEffect', () => {
	test('shows an element highlighted directly and as a child', () => {
		document.body.innerHTML = '<ul id="list"><li id="item">Item</li></ul>';

		const revert = highlightElementsEffect([
			{selector: '#item', attributes: ['id']},
			{selector: '#list', childrenSelector: 'li', tag: true, ifEmpty: true}
		])();

		const list = document.getElementById('list');
		const item = document.getElementById('item');

		// Each display is shown next to its own target.
		expect(list.nextElementSibling.textContent).toContain('li');
		expect(item.nextElementSibling.textContent).toContain('id="item"');

		revert();
		expect(document.querySelectorAll('.rgaaExt-HelperContainer')).toHaveLength(
			0
		);
	});

	test('skips invalid selectors', () => {
		document.body.innerHTML = '<p id="p">Text</p>';
		vi.spyOn(console, 'error').mockImplementation(() => {});

		const revert = highlightElementsEffect([
			{selector: '[invalid'},
			{selector: '#p', outline: true}
		])();

		expect(document.getElementById('p').classList).toContain(
			'rgaaExt-Highlight--outline'
		);

		revert();
		expect(document.getElementById('p').classList).not.toContain(
			'rgaaExt-Highlight--outline'
		);
	});
});
