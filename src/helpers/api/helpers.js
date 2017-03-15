import {isArray, first, tail} from 'lodash';
import * as modules from '../helpers';



/**
 *
 */
const getModule = (name) =>
	modules[name];

/**
 *	Extracts info out of the given helper descriptor.
 *
 *	@param {string|array} helper - Helper descriptor. This can
 *		be either a string containing the helper's name, or an
 *		array containing the helper's name, followed by its
 *		arguments, for example : ["helperName", "arg1", "arg2"].
 */
export const info = (helper) => {
	const infoArray = isArray(helper) ? helper : [helper];
	const name = first(infoArray);
	const args = tail(infoArray);
	const module = getModule(name);

	return {
		module,
		name,
		args
	};
};

/**
 *	Asks for the given helper to describe its potential actions.
 *
 *	@param {string|array} helper - Helper descriptor.
 */
export const describe = (intl, helper) => {
	const {module, args} = info(helper);
	return module.describe(intl, ...args);
};

/**
 *
 */
export const component = (helper) => {
	const {module, args} = info(helper);
	return ('component' in module)
		? module.component(...args)
		: null;
};

/**
 *	Creates an uuid from a test id and a helper index.
 *	Also ensures that there is no dot in the name, so it can
 *	be queried if used as an id or class name in the DOM.
 */
const createId = (id, index) =>
	`rgaaExt-Helper--${id}-${index}`.replace(/\./g, '-');

/**
 *	Calls a specific function on each of the given helpers.
 *
 *	@param {string} id - Id.
 *	@param {string|array} helper - Helper descriptor.
 *	@param {string} func - Name of the module's function to call,
 *		either 'apply' or 'revert'.
 */
const runHelpers = (id, helpers, func) => {
	try {
		helpers.forEach((helper, i) => {
			const {module, args} = info(helper);
			module[func](createId(id, i), ...args);
		});
	} catch (e) {
		console.error(e);
	}
};

/**
 *
 */
export const applyHelpers = (id, helpers) => {
	document.body.classList.add('rgaaExt-Body', 'rgaaExt-Body--withHelpers');
	runHelpers(id, helpers, 'apply');
};

/**
 *
 */
export const revertHelpers = (id, helpers) => {
	runHelpers(id, helpers, 'revert');
	document.body.classList.remove('rgaaExt-Body', 'rgaaExt-Body--withHelpers');
};
