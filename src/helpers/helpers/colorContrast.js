import $ from 'jquery';
import {forEach} from 'lodash';
import {createMessageHandler, sendMessage} from '../../common/utils/runtime';
import {getPixel} from '../../background/slices/runtime';
import {
	mutedAttributeSelector,
	muteAttribute,
	restoreAttribute
} from '../utils/muteAttributes';
import waitForEvent from '../utils/waitForEvent';
import getSelectionStyle from '../utils/getSelectionStyle';
import {
	requestPixelColor,
	requestTextColor,
	requestStyle,
	updateColor,
	updateStyle
} from '../slices/colorContrast';
import ColorContrast from '../components/ColorContrast';

const PickingStates = {
	pickingPixel: 'rgaaExt-ColorContrastHelper--pickingPixel',
	pickingText: 'rgaaExt-ColorContrastHelper--pickingText',
	processing: 'rgaaExt-ColorContrastHelper--processing'
};

const setPickingState = (className) =>
	forEach(PickingStates, (c) => {
		document.body.classList.toggle(c, c === className);
	});

const startPicking = (state) => {
	setPickingState(state);
	muteAttribute($('a'), 'href');
};

const stopPicking = () => {
	const selector = mutedAttributeSelector('href', 'a');

	setPickingState(null);
	restoreAttribute($(selector), 'href');
};

const handleMessage = createMessageHandler(async (action) => {
	if (requestPixelColor.match(action)) {
		try {
			startPicking(PickingStates.pickingPixel);
			const {clientX, clientY} = await waitForEvent('click');
			setPickingState(PickingStates.processing);
			const color = await sendMessage(
				getPixel({
					x: clientX,
					y: clientY
				})
			);

			await sendMessage(updateColor(color));
		} finally {
			stopPicking();
		}
	} else if (requestTextColor.match(action)) {
		try {
			startPicking(PickingStates.pickingText);
			await waitForEvent('mouseup');
			setPickingState(PickingStates.processing);
			const {color} = await getSelectionStyle();
			await sendMessage(updateColor(color));
		} finally {
			stopPicking();
		}
	} else if (requestStyle.match(action)) {
		try {
			startPicking(PickingStates.pickingText);
			await waitForEvent('mouseup');
			setPickingState(PickingStates.processing);
			const style = await getSelectionStyle();
			await sendMessage(updateStyle(style));
		} finally {
			stopPicking();
		}
	}
});

export const component = () => ColorContrast;

/**
 *	Describes the helper.
 */
export const describe = (intl) =>
	intl.formatMessage({
		id: 'Helper.colorContrast'
	});

export const apply = () => {
	browser.runtime.onMessage.addListener(handleMessage);
};

export const revert = () => {
	browser.runtime.onMessage.removeListener(handleMessage);
};
