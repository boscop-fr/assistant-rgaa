import browser from 'webextension-polyfill';
import ColorContrast from '../components/ColorContrast';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor,
	updateColor,
	updateStyle
} from '../slices/colorContrast';
import {createHelper} from '../utils/createHelper';
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

const handleMessage = async (action: unknown) => {
	switch (true) {
		case requestPixelColor.match(action):
			try {
				startPicking(PickingStates.pickingPixel);
				const {clientX, clientY} = await waitForEvent('click');
				setPickingState(PickingStates.processing);
				const color = await captureCurrentTabPixel(clientX, clientY);
				await browser.runtime.sendMessage(updateColor(color));
			} finally {
				stopPicking();
			}
			break;

		case requestTextColor.match(action):
			try {
				startPicking(PickingStates.pickingText);
				await waitForEvent('mouseup');
				setPickingState(PickingStates.processing);
				const {color} = await getSelectionStyle();
				await browser.runtime.sendMessage(updateColor(color));
			} finally {
				stopPicking();
			}
			break;

		case requestStyle.match(action):
			try {
				startPicking(PickingStates.pickingText);
				await waitForEvent('mouseup');
				setPickingState(PickingStates.processing);
				const style = await getSelectionStyle();
				await browser.runtime.sendMessage(updateStyle(style));
			} finally {
				stopPicking();
			}
			break;
	}
};

export type ColorContrastStyle = {
	backgroundColor: string;
	color: string;
	fontSize: string;
	fontWeight: string;
};

export type ColorInputConfig = {
	label: string;
	pixelPicker: boolean;
	textPicker: boolean;
};

export type ColorExtractorConfig = {
	label: string;
	left: keyof ColorContrastStyle;
	right: keyof ColorContrastStyle;
};

type ColorContrastOptions = {
	minimumRatio: number;
	left: ColorInputConfig;
	right: ColorInputConfig;
	extractor?: ColorExtractorConfig;
};

export default createHelper({
	name: 'colorContrast',
	defaultOptions: {
		left: {
			label: 'ColorContrast.textColor',
			pixelPicker: true,
			textPicker: true
		},
		right: {
			label: 'ColorContrast.backgroundColor',
			pixelPicker: true,
			textPicker: false
		},
		extractor: {
			label: 'ColorContrast.extract',
			left: 'color',
			right: 'backgroundColor'
		}
	} as ColorContrastOptions,
	component: ColorContrast,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.colorContrast'
		});
	},
	apply() {
		return () => {
			browser.runtime.onMessage.addListener(handleMessage);

			return () => {
				browser.runtime.onMessage.removeListener(handleMessage);
			};
		};
	}
});
