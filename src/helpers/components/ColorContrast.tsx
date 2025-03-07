import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {contrast} from '../../common/utils/color';
import {sendMessage, useRuntimeMessage} from '../../common/utils/runtime';
import type {
	ColorExtractorConfig,
	ColorInputConfig
} from '../helpers/colorContrast';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor,
	updateColor,
	updateStyle
} from '../slices/colorContrast';
import ColorContrastField from './ColorContrastField';
import ColorContrastResult from './ColorContrastResult';
import ToggleButton from './ToggleButton';

type ColorName = 'left' | 'right';
type PickAction =
	| ReturnType<typeof requestPixelColor>
	| ReturnType<typeof requestTextColor>
	| ReturnType<typeof requestStyle>;

// This whole thing is VERY obscure.
// The communication between the widgets and the page
// needs a proper refactoring to be more simple and robust.
const usePicker = (extractor: ColorExtractorConfig) => {
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

	const pickColor = (name: ColorName, action: PickAction) => {
		sendMessage(action);
		setPickerState((state) => ({
			...state,
			pickingName: name,
			pickingAction: action
		}));
	};

	const pickPixel = (name: ColorName) => {
		pickColor(name, requestPixelColor());
	};

	const pickText = (name: ColorName) => {
		pickColor(name, requestTextColor());
	};

	const pickStyle = () => {
		pickColor(null, requestStyle());
	};

	useRuntimeMessage((action) => {
		if (updateColor.match(action)) {
			setPickerState((state) => ({
				...state,
				[state.pickingName]: action.payload,
				pickingName: null,
				pickingAction: null
			}));
		}

		if (updateStyle.match(action)) {
			setPickerState(() => ({
				left: action.payload[extractor.left],
				right: action.payload[extractor.right],
				pickingName: null,
				pickingAction: null
			}));
		}
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
					<ToggleButton
						pressed={isPickingStyle()}
						onClick={() => pickStyle()}
					>
						{intl.formatMessage({id: extractor.label})}
					</ToggleButton>
				) : null}
			</form>

			<ColorContrastResult
				ratio={Number(contrast(colors.left, colors.right).toFixed(2))}
				minimumRatio={minimumRatio}
			/>
		</div>
	);
};

export default ColorContrast;
