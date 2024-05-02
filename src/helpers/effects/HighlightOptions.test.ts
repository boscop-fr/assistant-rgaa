import {describe, expect, test} from '@jest/globals';
import {HighlightOptions} from './HighlightOptions';

describe('HighlightOptions', function () {
	test('tag', function () {
		const options = new HighlightOptions(null as HTMLElement);
		expect(options.tag).toBeFalsy();

		options.showTag(false);
		expect(options.tag).toBeFalsy();

		options.showTag(true);
		expect(options.tag).toBeTruthy();

		options.showTag(false);
		expect(options.tag).toBeTruthy();
	});

	test('ifEmpty', function () {
		const options = new HighlightOptions(null as HTMLElement);
		expect(options.ifEmpty).toBeFalsy();

		options.showIfEmpty(false);
		expect(options.ifEmpty).toBeFalsy();

		options.showIfEmpty(true);
		expect(options.ifEmpty).toBeTruthy();

		options.showIfEmpty(false);
		expect(options.ifEmpty).toBeTruthy();
	});

	test('content', function () {
		const options = new HighlightOptions(null as HTMLElement);
		expect(options.content).toBeFalsy();

		options.showContent(false);
		expect(options.content).toBeFalsy();

		options.showContent(true);
		expect(options.content).toBeTruthy();

		options.showContent(false);
		expect(options.content).toBeTruthy();
	});

	test('outline', function () {
		const options = new HighlightOptions(null as HTMLElement);
		expect(options.outline).toBeFalsy();

		options.showOutline(false);
		expect(options.outline).toBeFalsy();

		options.showOutline(true);
		expect(options.outline).toBeTruthy();

		options.showOutline(false);
		expect(options.outline).toBeTruthy();
	});

	test('attributes', function () {
		const options = new HighlightOptions(null as HTMLElement);
		expect(options.attributes).toStrictEqual([]);
		expect(options.missingAttributes).toStrictEqual([]);

		options.pushAttributes(['a']);
		expect(options.attributes).toStrictEqual(['a']);
		expect(options.missingAttributes).toStrictEqual([]);

		options.pushAttributes(['b'], true);
		expect(options.attributes).toStrictEqual(['a', 'b']);
		expect(options.missingAttributes).toStrictEqual(['b']);
	});
});
