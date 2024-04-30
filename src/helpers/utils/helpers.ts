import {Helper, helperInfo} from '../types';

let activeHelpers: Helper[] = [];

export const toggleHelpers = (helpers: Helper[], toggle: boolean) => {
	const method = toggle ? 'apply' : 'revert';

	helpers.forEach((helper, i) => {
		try {
			const {module, args} = helperInfo(helper);
			module[method](args);
			document.body.classList.toggle(`rgaaExt-Body--${name}Helper`, toggle);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});

	document.body.classList.toggle('rgaaExt-Body', toggle);
	document.body.classList.toggle('rgaaExt-Body--withHelpers', toggle);
	activeHelpers = toggle ? helpers : [];
};

export const revertActiveHelpers = () => {
	toggleHelpers(activeHelpers, false);
};

export const applyHelpers = (helpers: Helper[]) => {
	revertActiveHelpers();
	toggleHelpers(helpers, true);
};
