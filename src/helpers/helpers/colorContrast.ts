import browser from 'webextension-polyfill';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor
} from '../slices/colorContrast';
import type {Effect} from '../types';
import getSelectionStyle from '../utils/getSelectionStyle';
import {captureCurrentTabPixel} from '../utils/images';
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

const setPickingState = (className: string) => {
	for (const c of Object.values(PickingStates)) {
		document.body.classList.toggle(c, c === className);
	}
};

const startPicking = (state: string) => {
	setPickingState(state);
	muteAttribute(document.querySelectorAll('a'), 'href');
};

const stopPicking = () => {
	const selector = mutedAttributeSelector('href', 'a');

	setPickingState(null);
	restoreAttribute(document.querySelectorAll(selector), 'href');
};

const withPicking = async <T>(state: string, pick: () => Promise<T>) => {
	try {
		startPicking(state);
		return await pick();
	} finally {
		stopPicking();
	}
};

// Answers picking requests with the picked value.
// This must not return anything for other messages, as the
// first listener returning a promise answers the message.
const handleMessage = (action: unknown) => {
	switch (true) {
		case requestPixelColor.match(action):
			return withPicking(PickingStates.pickingPixel, async () => {
				const {clientX, clientY} = await waitForEvent('click', true);
				setPickingState(PickingStates.processing);
				return captureCurrentTabPixel(clientX, clientY);
			});

		case requestTextColor.match(action):
			return withPicking(PickingStates.pickingText, async () => {
				await waitForEvent('mouseup');
				setPickingState(PickingStates.processing);
				const {color} = await getSelectionStyle();
				return color;
			});

		case requestStyle.match(action):
			return withPicking(PickingStates.pickingText, async () => {
				await waitForEvent('mouseup');
				setPickingState(PickingStates.processing);
				return getSelectionStyle();
			});
	}
};

export default (): Effect => () => {
	browser.runtime.onMessage.addListener(handleMessage);

	return () => {
		browser.runtime.onMessage.removeListener(handleMessage);
	};
};
