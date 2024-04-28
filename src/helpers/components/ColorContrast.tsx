import createColor from 'color';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {sendMessage, useRuntimeMessage} from '../../common/utils/runtime';
import {ColorExtractorConfig, ColorInputConfig} from '../helpers/colorContrast';
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

const contrastRatio = (left: string, right: string) => {
	try {
		const ratio = createColor(left).contrast(createColor(right));
		return Number(ratio.toFixed(3));
	} catch (e) {
		return 0;
	}
};

const usePicker = (extractor: ColorExtractorConfig) => {
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
				left: action.payload[extractor.left],
				right: action.payload[extractor.right]
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
	extractor?: ColorExtractorConfig;
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
	const intl = useIntl();
	const {colors, ratio, pickingAction, pickedColor, setColor, pickColor} =
		usePicker(extractor);

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
						{intl.formatMessage({id: extractor.label})}
					</ToggleButton>
				) : null}
			</form>

			<ColorContrastResult ratio={ratio} minimumRatio={minimumRatio} />
		</div>
	);
};

export default ColorContrast;
