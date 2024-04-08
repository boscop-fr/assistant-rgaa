import $ from 'jquery';
import {forEach} from 'lodash';
import {type IntlShape} from 'react-intl';
import {getPixel} from '../../background/slices/runtime';
import {createMessageHandler, sendMessage} from '../../common/utils/runtime';
import ColorContrast from '../components/ColorContrast';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor,
	updateColor,
	updateStyle
} from '../slices/colorContrast';
import getSelectionStyle from '../utils/getSelectionStyle';
import {
	muteAttribute,
	mutedAttributeSelector,
	restoreAttribute
} from '../utils/muteAttributes';
import waitForEvent from '../utils/waitForEvent';

const PickingStates = {
	pickingPixel: 'rgaaExt-ColorContrastHelper--pickingPixel',
	pickingText: 'rgaaExt-ColorContrastHelper--pickingText',
	processing: 'rgaaExt-ColorContrastHelper--processing'
};

const setPickingState = (className: string) =>
	forEach(PickingStates, (c) => {
		document.body.classList.toggle(c, c === className);
	});

const startPicking = (state: string) => {
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
			const color = await sendMessage<string>(
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

export const describe = (intl: IntlShape) =>
	intl.formatMessage({
		id: 'Helper.colorContrast'
	});

export const apply = () => {
	browser.runtime.onMessage.addListener(handleMessage);
};

export const revert = () => {
	browser.runtime.onMessage.removeListener(handleMessage);
};
