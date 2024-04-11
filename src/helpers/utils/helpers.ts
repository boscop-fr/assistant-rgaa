import {Helper, helperInfo} from '../types';

// Helper sets are indexed by test id.
// Given how the app works, we're assuming that a test is
// always associated with the same set of helpers, so it
// simplifies the storage of active helpers.
const activeHelpers = new Map<string, Helper[]>();

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
			const {module, args} = helperInfo(helper);
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

	activeHelpers.clear();
};
