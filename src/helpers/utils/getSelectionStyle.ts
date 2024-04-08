import createColor from 'color';
import {getPixel} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/runtime';
import wait from '../../common/utils/wait';
import {ColorContrastStyle} from '../slices/colorContrast';

const getSelectionStyle = async (): Promise<ColorContrastStyle> => {
	const selection = window.getSelection();
	const anchor = selection.anchorNode.parentElement;
	const style = window.getComputedStyle(anchor);
	const rect = selection.getRangeAt(0).getBoundingClientRect();

	// cancels the selection so the color picker doesn't pick
	// the selection background color
	selection.removeAllRanges();

	// We're waiting a bit to ensure the selection is actually
	// removed before getting the background color.
	// Otherwise we could get the selection color instead of
	// the real background one.
	await wait(100);

	const backgroundColor = await sendMessage<string>(
		getPixel({
			x: rect.left,
			y: rect.top
		})
	);

	return {
		backgroundColor,
		color: createColor(style.getPropertyValue('color')).hex().toString(),
		fontSize: style.getPropertyValue('font-size'),
		fontWeight: style.getPropertyValue('font-weight')
	};
};

export default getSelectionStyle;
