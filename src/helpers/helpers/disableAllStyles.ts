import $ from 'jquery';
import {type IntlShape} from 'react-intl';
import {
	muteAttribute,
	mutedAttributeSelector,
	restoreAttribute
} from '../utils/muteAttributes';
import toggleStyleSheets from '../utils/toggleStyleSheets';
import {apply as applyStyle, revert as revertStyle} from './style';

export const describe = (intl: IntlShape) =>
	intl.formatMessage({
		id: 'Helper.disableAllStyles'
	});

// Disable all style sheets in the page.
export const apply = (id: string) => {
	toggleStyleSheets(false);
	muteAttribute($('[style]'), 'style');
	applyStyle(id, {
		style: `
			img, svg, embed[type="image"], object[type="image"] {
				width: auto !important;
				height: auto !important;
				max-width: 400px !important;
				max-height: 400px !important;
			}
		`
	});
};

// Enable all style sheets that were previously disabled
// using apply().
export const revert = (id: string) => {
	const selector = mutedAttributeSelector('style');

	revertStyle(id);
	restoreAttribute($(selector), 'style');
	toggleStyleSheets(true);
};
