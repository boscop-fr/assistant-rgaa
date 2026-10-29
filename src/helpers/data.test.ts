import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, test} from 'vitest';
import type {HelpersByTest} from '../common/types';
import {
	type Helper,
	type HelperName,
	type HelperOptions,
	helperOptions
} from './types';

// Tells whether each option is required, i.e. not optional.
type OptionsSpec<T> = {
	// biome-ignore lint/complexity/noBannedTypes: checks optionality.
	[K in keyof T]-?: {} extends Pick<T, K> ? false : true;
};

// Every option of every helper, checked by the compiler
// against the helpers' option types.
const specs: {[N in HelperName]: OptionsSpec<HelperOptions<N>>} = {
	colorContrast: {
		minimumRatio: true,
		left: true,
		right: true,
		extractor: false
	},
	disableAllStyles: {},
	externalTool: {name: true, url: true},
	headingsHierarchy: {showMissing: false},
	outline: {selector: true, showTag: false},
	showAttributes: {selector: true, attributes: true, showMissing: false},
	showChildElements: {
		selector: true,
		childrenSelector: true,
		attributes: false,
		showEmpty: false,
		showName: false,
		showMissingAttributes: false,
		showContent: false
	},
	showElement: {
		selector: true,
		attributes: false,
		showEmpty: false,
		showName: false,
		showMissingAttributes: false,
		showContent: false
	},
	style: {style: true, description: false},
	validateLocalPage: {},
	viewSource: {}
};

// Lists problems in a helper from the mapping.
const helperErrors = (helper: Helper) => {
	const spec: Record<string, boolean> = specs[helper.helper];

	if (!spec) {
		return [`unknown helper "${helper.helper}"`];
	}

	const options = helperOptions(helper) as Record<string, unknown>;
	const unknown = Object.keys(options)
		.filter((option) => !(option in spec))
		.map((option) => `unknown option "${option}"`);

	const missing = Object.entries(spec)
		.filter(([option, required]) => required && options[option] === undefined)
		.map(([option]) => `missing option "${option}"`);

	return [...unknown, ...missing];
};

const dir = join(__dirname, '../../data/helpers');

describe.each(readdirSync(dir))('data/helpers/%s', (file) => {
	test('only uses known helpers, with valid options', () => {
		const mapping: HelpersByTest = JSON.parse(
			readFileSync(join(dir, file), 'utf8')
		);

		const errors = Object.entries(mapping).flatMap(([id, helpers]) =>
			helpers.flatMap((helper, i) =>
				helperErrors(helper).map(
					(error) => `${id} #${i} (${helper.helper}): ${error}`
				)
			)
		);

		expect(errors).toStrictEqual([]);
	});
});
