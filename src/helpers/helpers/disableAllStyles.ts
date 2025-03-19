import {
	muteElementsAttributeEffect,
	toggleClassEffect,
	toggleStyleSheetsEffect
} from '../effects/dom';
import {createHelper} from '../utils/createHelper';
import {combineEffects} from '../utils/effects';
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
		return combineEffects([
			toggleClassEffect(document.body, 'rgaaExt-DisableAllStylesHelper'),
			toggleStyleSheetsEffect(false),
			muteElementsAttributeEffect('[style]', 'style'),
			styleHelper.apply({
				style: CssReset
			})
		]);
	}
});
