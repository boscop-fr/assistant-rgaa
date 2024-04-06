import createColor from 'color';
import {get} from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import renderIf from 'render-if';
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

const colorInputConfigShape = PropTypes.shape({
	label: PropTypes.string,
	pixelPicker: PropTypes.bool,
	textPicker: PropTypes.bool
});

const extractorConfigShape = PropTypes.shape({
	label: PropTypes.string,
	left: PropTypes.string,
	right: PropTypes.string
});

const contrastRatio = (left, right) => {
	try {
		const ratio = createColor(left).contrast(createColor(right));
		return Number(ratio.toFixed(3));
	} catch (e) {
		return 0;
	}
};

const usePicker = (extractor) => {
	const [colors, setColors] = useState({
		left: '#fff',
		right: '#fff'
	});

	const [pickingAction, setPickAction] = useState();
	const [pickedColor, setPickedColor] = useState();

	const setColor = (name, value) => {
		setColors((current) => ({
			...current,
			[name]: value
		}));
	};

	const pickColor = (name, action) => {
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

/**
 *	This whole thing is VERY obscure.
 *	The communication between the widgets and the page
 *	needs a proper refactoring to be more simple and robust.
 */
const ColorContrast = ({left, right, extractor, minimumRatio}) => {
	const {colors, ratio, pickingAction, pickedColor, setColor, pickColor} =
		usePicker(extractor);

	const renderField = (name, {label, pixelPicker, textPicker}) => (
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

				{renderIf(extractor)(() => (
					<ToggleButton
						pressed={requestStyle.match(pickingAction)}
						onClick={() => pickColor(null, requestStyle())}
					>
						{extractor.label}
					</ToggleButton>
				))}
			</form>

			<ColorContrastResult ratio={ratio} minimumRatio={minimumRatio} />
		</div>
	);
};

ColorContrast.propTypes = {
	left: colorInputConfigShape.isRequired,
	right: colorInputConfigShape.isRequired,
	extractor: extractorConfigShape,
	minimumRatio: PropTypes.number.isRequired
};

ColorContrast.defaultProps = {
	extractor: undefined
};

export default ColorContrast;
