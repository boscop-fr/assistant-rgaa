import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {contrastRatio} from '../../../common/utils/color';
import {browser} from '../../../common/utils/webExtension';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor
} from '../../../helpers/slices/colorContrast';
import type {
	ColorContrastStyle,
	ColorExtractorConfig,
	ColorInputConfig
} from '../../../helpers/types';
import {selectTargetTabId} from '../../slices/panel';
import ColorContrastField from './ColorContrastField';
import ColorContrastResult from './ColorContrastResult';
import ToggleButton from './ToggleButton';

type ColorName = 'left' | 'right';
type PickAction =
	| ReturnType<typeof requestPixelColor>
	| ReturnType<typeof requestTextColor>
	| ReturnType<typeof requestStyle>;

const usePicker = (extractor: ColorExtractorConfig) => {
	const tabId = useSelector(selectTargetTabId);
	const [pickerState, setPickerState] = useState<{
		left: string;
		right: string;
		pickingName?: ColorName;
		pickingAction?: PickAction;
	}>({
		left: '#fff',
		right: '#fff'
	});

	const isPickingPixel = (name: ColorName) =>
		pickerState?.pickingName === name &&
		requestPixelColor.match(pickerState?.pickingAction);

	const isPickingText = (name: ColorName) =>
		pickerState?.pickingName === name &&
		requestTextColor.match(pickerState?.pickingAction);

	const isPickingStyle = () => requestStyle.match(pickerState?.pickingAction);

	const setColor = (name: string, value: string) => {
		setPickerState((current) => ({
			...current,
			[name]: value
		}));
	};

	// Asks the page to pick something, and waits for the
	// picked value.
	const pick = async <T,>(
		pickingName: ColorName,
		pickingAction: PickAction,
		onPicked: (value: T) => void
	) => {
		// Concurrent picks would mix their state on the page.
		if (pickerState.pickingAction) {
			return;
		}

		setPickerState((state) => ({...state, pickingName, pickingAction}));

		try {
			const value = await browser.tabs.sendMessage(tabId, pickingAction);

			// The page answers nothing if picking failed.
			if (value !== undefined) {
				onPicked(value as T);
			}
		} catch (e) {
			// The page might have been reloaded or closed while
			// picking.
			console.error(e);
		} finally {
			setPickerState((state) => ({
				...state,
				pickingName: null,
				pickingAction: null
			}));
		}
	};

	const pickPixel = (name: ColorName) =>
		pick<string>(name, requestPixelColor(), (color) => setColor(name, color));

	const pickText = (name: ColorName) =>
		pick<string>(name, requestTextColor(), (color) => setColor(name, color));

	const pickStyle = () =>
		pick<ColorContrastStyle>(null, requestStyle(), (style) => {
			setPickerState((state) => ({
				...state,
				left: style[extractor.left],
				right: style[extractor.right]
			}));
		});

	return {
		setColor,
		isPickingPixel,
		isPickingText,
		isPickingStyle,
		pickPixel,
		pickText,
		pickStyle,
		colors: {
			left: pickerState.left,
			right: pickerState.right
		}
	};
};

type ColorContrastProps = {
	left: ColorInputConfig;
	right: ColorInputConfig;
	extractor?: ColorExtractorConfig;
	minimumRatio: number;
};

const ColorContrast = ({
	left,
	right,
	extractor,
	minimumRatio
}: ColorContrastProps) => {
	const intl = useIntl();
	const {
		colors,
		setColor,
		isPickingPixel,
		isPickingText,
		isPickingStyle,
		pickPixel,
		pickText,
		pickStyle
	} = usePicker(extractor);

	const renderField = (
		name: ColorName,
		{label, pixelPicker, textPicker}: ColorInputConfig
	) => (
		<ColorContrastField
			name={name}
			label={intl.formatMessage({id: label})}
			color={colors[name]}
			hasPixelPicker={pixelPicker}
			hasTextPicker={textPicker}
			isPickingPixel={isPickingPixel(name)}
			isPickingText={isPickingText(name)}
			onPickPixel={() => pickPixel(name)}
			onPickText={() => pickText(name)}
			onChangeColor={(value) => setColor(name, value)}
		/>
	);

	return (
		<div className="ColorContrast Widget">
			<form className="Form">
				<div className="Form-row">
					{renderField('left', left)}
					{renderField('right', right)}
				</div>

				{extractor ? (
					<ToggleButton pressed={isPickingStyle()} onClick={() => pickStyle()}>
						{intl.formatMessage({id: extractor.label})}
					</ToggleButton>
				) : null}
			</form>

			<ColorContrastResult
				ratio={contrastRatio(colors.left, colors.right)}
				minimumRatio={minimumRatio}
			/>
		</div>
	);
};

export default ColorContrast;
