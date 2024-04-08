import {JSXElementConstructor} from 'react';
import {type IntlShape} from 'react-intl';
import {Helper} from '../../common/types';
import * as modules from '../helpers';

type HelperOptions = Record<string, any>;
type HelperModule = {
	defaults?: HelperOptions;
	component?: (options: HelperOptions) => JSXElementConstructor<{}>;
	describe: (intl: IntlShape, options: HelperOptions) => string;
	apply?: (uuid: string, options: HelperOptions) => void;
	revert?: (uuid: string) => void;
};

// Helper sets are indexed by test id.
// Given how the app works, we're assuming that a test is
// always associated with the same set of helpers, so it
// simplifies the storage of active helpers.
const activeHelpers = new Map<string, Helper[]>();

const getModule = (name: keyof typeof modules) => modules[name] as HelperModule;

// Extracts info out of the given helper descriptor.
export const info = ({helper, ...args}: Helper) => ({
	args,
	name: helper,
	module: getModule(helper as keyof typeof modules)
});

// Asks for the given helper to describe its potential actions.
export const describe = (intl: IntlShape, helper: Helper) => {
	const {module, args} = info(helper);
	return module.describe(intl, args);
};

export const component = (helper: Helper) => {
	const {module, args} = info(helper);
	return 'component' in module ? module.component(args) : null;
};

// Creates an uuid from a test id and a helper index.
// Also ensures that there is no dot in the name, so it can
// be queried if used as an id or class name in the DOM.
const createId = (id: string, index: number) =>
	`rgaaExt-Helper--${id}-${index}`.replace(/\./g, '-');

const toggleBodyClasses = () => {
	const areAnyHelperActive = activeHelpers.size > 0;

	document.body.classList.toggle('rgaaExt-Body', areAnyHelperActive);
	document.body.classList.toggle(
		'rgaaExt-Body--withHelpers',
		areAnyHelperActive
	);
};

export const toggleHelpers = (
	id: string,
	helpers: Helper[],
	toggle: boolean
) => {
	if (activeHelpers.has(id) === toggle) {
		return;
	}

	const method = toggle ? 'apply' : 'revert';

	helpers.forEach((helper, i) => {
		try {
			const {name, module, args} = info(helper);
			module[method](createId(id, i), args);
			document.body.classList.toggle(`rgaaExt-Body--${name}Helper`, toggle);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});

	if (toggle) {
		activeHelpers.set(id, helpers);
	} else {
		activeHelpers.delete(id);
	}

	toggleBodyClasses();
};

export const revertActiveHelpers = () => {
	activeHelpers.forEach((helpers, id) => {
		toggleHelpers(id, helpers, false);
	});
};
