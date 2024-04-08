import {toArray} from 'lodash';

// Toggles all style sheets in the page.
const toggleStyleSheets = (toggled: boolean) => {
	toArray(document.styleSheets).forEach((stylesheet) => {
		if ('rgaaext' in (stylesheet.ownerNode as HTMLElement)?.dataset) {
			return;
		}

		// eslint-disable-next-line no-param-reassign
		stylesheet.disabled = !toggled;
	});
};

export default toggleStyleSheets;
