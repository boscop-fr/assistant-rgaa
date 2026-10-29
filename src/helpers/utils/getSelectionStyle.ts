import {cssToHex} from '../../common/utils/color';
import wait from '../../common/utils/wait';
import type {ColorContrastStyle} from '../types';
import {captureCurrentTabPixel} from './images';

const getSelectionStyle = async (): Promise<ColorContrastStyle> => {
	const selection = window.getSelection();
	const parent = selection?.anchorNode?.parentElement;

	if (!selection || !parent) {
		throw new Error('Nothing is selected');
	}

	const style = window.getComputedStyle(parent);
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
