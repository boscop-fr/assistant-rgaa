import {cssToHex} from '../../common/utils/color';
import wait from '../../common/utils/wait';
import {ColorContrastStyle} from '../helpers/colorContrast';
import {captureCurrentTabPixel} from './images';

const getSelectionStyle = async (): Promise<ColorContrastStyle> => {
	const selection = window.getSelection();
	const style = window.getComputedStyle(selection.anchorNode.parentElement);
	const rect = selection.getRangeAt(0).getBoundingClientRect();

	// cancels the selection so the color picker doesn't pick
	// the selection background color
	selection.removeAllRanges();

	// We're waiting a bit to ensure the selection is actually
	// removed before getting the background color.
	// Otherwise we could get the selection color instead of
	// the real background one.
	await wait(100);

	const backgroundColor = await captureCurrentTabPixel(rect.left, rect.top);

	return {
		backgroundColor,
		color: cssToHex(style.getPropertyValue('color')),
		fontSize: style.getPropertyValue('font-size'),
		fontWeight: style.getPropertyValue('font-weight')
	};
};

export default getSelectionStyle;
