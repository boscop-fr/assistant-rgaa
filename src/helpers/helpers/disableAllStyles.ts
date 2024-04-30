import {createHelper} from '../utils/createHelper';
import {
	muteAttribute,
	mutedAttributeSelector,
	restoreAttribute
} from '../utils/muteAttributes';
import toggleStyleSheets from '../utils/toggleStyleSheets';
import styleHelper from './style';

const CssReset = `
	img, svg, embed[type="image"], object[type="image"] {
		width: auto !important;
		height: auto !important;
		max-width: 400px !important;
		max-height: 400px !important;
	}
`;

export default createHelper({
	name: 'disableAllStyles',
	defaultOptions: {},
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.disableAllStyles'
		});
	},
	apply() {
		toggleStyleSheets(false);
		muteAttribute(document.querySelectorAll('[style]'), 'style');
		styleHelper.apply({
			style: CssReset
		});
	},
	revert(id) {
		const selector = mutedAttributeSelector('style');

		styleHelper.revert({style: CssReset});
		restoreAttribute(document.querySelectorAll(selector), 'style');
		toggleStyleSheets(true);
	}
});
