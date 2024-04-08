import createColor from 'color';
import {get} from 'lodash';
import React, {useEffect, useState} from 'react';
import {sendMessage, useRuntimeMessage} from '../../common/utils/runtime';
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

type ColorInputConfig = {
	label: string;
	pixelPicker: boolean;
	textPicker: boolean;
};

type ExtractorConfig = {
	label: string;
	left: string;
	right: string;
};

type ColorName = 'left' | 'right';
type PickAction =
	| ReturnType<typeof requestPixelColor>
	| ReturnType<typeof requestTextColor>
	| ReturnType<typeof requestStyle>;

const contrastRatio = (left: string, right: string) => {
	try {
		const ratio = createColor(left).contrast(createColor(right));
		return Number(ratio.toFixed(3));
	} catch (e) {
		return 0;
	}
};

const usePicker = (extractor: ExtractorConfig) => {
	const [colors, setColors] = useState({
		left: '#fff',
		right: '#fff'
	});

	const [pickingAction, setPickAction] = useState<PickAction>();
	const [pickedColor, setPickedColor] = useState<ColorName>();

	const setColor = (name: string, value: string) => {
		setColors((current) => ({
			...current,
			[name]: value
		}));
	};

	const pickColor = (name: ColorName, action: PickAction) => {
		setPickedColor(name);
		setPickAction(action);
	};

	const stopPicking = () => {
		setPickAction(null);
		setPickedColor(null);
	};

	useRuntimeMessage((action) => {
		if (updateColor.match(action)) {
			setColor(pickedColor, action.payload);
			stopPicking();
		} else if (updateStyle.match(action)) {
			setColors({
				left: get(action.payload, extractor.left),
				right: get(action.payload, extractor.right)
			});
			stopPicking();
		}
	});

	useEffect(() => {
		if (pickingAction) {
			sendMessage(pickingAction);
		}
	}, [pickingAction]);

	return {
		colors,
		pickingAction,
		pickedColor,
		setColor,
		pickColor,
		ratio: contrastRatio(colors.left, colors.right)
	};
};

type ColorContrastProps = {
	left: ColorInputConfig;
	right: ColorInputConfig;
	extractor?: ExtractorConfig;
	minimumRatio: number;
};

// This whole thing is VERY obscure.
// The communication between the widgets and the page
// needs a proper refactoring to be more simple and robust.
const ColorContrast = ({
	left,
	right,
	extractor,
	minimumRatio
}: ColorContrastProps) => {
	const {colors, ratio, pickingAction, pickedColor, setColor, pickColor} =
		usePicker(extractor);

	const renderField = (
		name: ColorName,
		{label, pixelPicker, textPicker}: ColorInputConfig
	) => (
		<ColorContrastField
			name={name}
			label={label}
			color={colors[name]}
			hasPixelPicker={pixelPicker}
			hasTextPicker={textPicker}
			isPickingPixel={
				pickedColor === name && requestPixelColor.match(pickingAction)
			}
			isPickingText={
				pickedColor === name && requestTextColor.match(pickingAction)
			}
			onPickPixel={() => pickColor(name, requestPixelColor())}
			onPickText={() => pickColor(name, requestTextColor())}
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
						pressed={requestStyle.match(pickingAction)}
						onClick={() => pickColor(null, requestStyle())}
					>
						{extractor.label}
					</ToggleButton>
				) : null}
			</form>

			<ColorContrastResult ratio={ratio} minimumRatio={minimumRatio} />
		</div>
	);
};

export default ColorContrast;
