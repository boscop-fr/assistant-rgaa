import $ from 'jquery';
import {createHelper} from '../utils/createHelper';
import {
	muteAttribute,
	mutedAttributeSelector,
	restoreAttribute
} from '../utils/muteAttributes';
import toggleStyleSheets from '../utils/toggleStyleSheets';
import styleHelper from './style';

export default createHelper({
	name: 'disableAllStyles',
	defaultOptions: {},
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.disableAllStyles'
		});
	},
	apply(id) {
		toggleStyleSheets(false);
		muteAttribute($('[style]'), 'style');
		styleHelper.apply(id, {
			style: `
				img, svg, embed[type="image"], object[type="image"] {
					width: auto !important;
					height: auto !important;
					max-width: 400px !important;
					max-height: 400px !important;
				}
			`
		});
	},
	revert(id) {
		const selector = mutedAttributeSelector('style');

		// Style helper's `revert()` doesn't take any options
		// but the type comes from `HelperModule`, so we're
		// forcing a type to please the TS compiler.
		// @TODO Fix this on `HelperModule` type.
		styleHelper.revert(
			id,
			undefined as (typeof styleHelper)['defaultOptions']
		);

		restoreAttribute($(selector), 'style');
		toggleStyleSheets(true);
	}
});
