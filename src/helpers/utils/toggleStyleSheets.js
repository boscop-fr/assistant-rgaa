import {toArray} from 'lodash';

/**
 *	Toggles all style sheets in the page.
 *
 *	@param {boolean} toggled - Whether or not to enable styles.
 */
export default function toggleStyleSheets(toggled) {
	toArray(document.styleSheets).forEach((stylesheet) => {
		if ('rgaaext' in stylesheet.ownerNode.dataset) {
			return;
		}

		// eslint-disable-next-line no-param-reassign
		stylesheet.disabled = !toggled;
	});
}
