import * as modules from '../helpers';

// Helper sets are indexed by test id.
// Given how the app works, we're assuming that a test is
// always associated with the same set of helpers, so it
// simplifies the storage of active helpers.
const activeHelpers = new Map();

/**
 *
 */
const getModule = (name) => modules[name];

/**
 *	Extracts info out of the given helper descriptor.
 *
 *	@param {string|array} helper - Helper descriptor, i.e. an
 *		object containing a key "helper", holding the helper name,
 *		and an arbitrary number of other options.
 */
export const info = ({helper, ...args}) => ({
	args,
	name: helper,
	module: getModule(helper)
});

/**
 *	Asks for the given helper to describe its potential actions.
 *
 *	@param {object} helper - Helper descriptor.
 */
export const describe = (intl, helper) => {
	const {module, args} = info(helper);
	return module.describe(intl, args);
};

/**
 *
 */
export const component = (helper) => {
	const {module, args} = info(helper);
	return 'component' in module ? module.component(args) : null;
};

/**
 *	Creates an uuid from a test id and a helper index.
 *	Also ensures that there is no dot in the name, so it can
 *	be queried if used as an id or class name in the DOM.
 */
const createId = (id, index) =>
	`rgaaExt-Helper--${id}-${index}`.replace(/\./g, '-');

const toggleBodyClasses = () => {
	const areAnyHelperActive = activeHelpers.size > 0;

	document.body.classList.toggle('rgaaExt-Body', areAnyHelperActive);
	document.body.classList.toggle(
		'rgaaExt-Body--withHelpers',
		areAnyHelperActive
	);
};

/**
 *	Calls a specific function on each of the given helpers.
 *
 *	@param {string} id - Id.
 *	@param {string|array} helper - Helper descriptor.
 *	@param {string} func - Name of the module's function to call,
 *		either 'apply' or 'revert'.
 */
export const toggleHelpers = (id, helpers, toggle) => {
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
