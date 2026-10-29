import {
	muteElementsAttributeEffect,
	toggleClassEffect,
	toggleStyleSheetsEffect
} from '../effects/dom';
import {combineEffects} from '../utils/effects';
import style from './style';

const CssReset = `
	img, svg, embed[type="image"], object[type="image"] {
		width: auto !important;
		height: auto !important;
		max-width: 400px !important;
		max-height: 400px !important;
	}
`;

export default () =>
	combineEffects([
		toggleClassEffect(document.body, 'rgaaExt-DisableAllStylesHelper'),
		toggleStyleSheetsEffect(false),
		muteElementsAttributeEffect('[style]', 'style'),
		style({
			style: CssReset
		})
	]);
