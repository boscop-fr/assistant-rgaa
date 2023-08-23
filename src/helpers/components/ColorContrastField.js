import PropTypes from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';
import renderIf from 'render-if';
import Icon from '../../panel/components/Icon';
import ColorInput from './ColorInput';
import ToggleButton from './ToggleButton';

const ColorContrastField = ({
	name,
	label,
	color,
	hasPixelPicker,
	hasTextPicker,
	isPickingPixel,
	isPickingText,
	onPickPixel,
	onPickText,
	onChangeColor
}) => {
	const intl = useIntl();
	const id = `ColorContrastField--${name}`;

	return (
		<div className="Form-field" key={name}>
			<label className="Form-label" htmlFor={id}>
				{label}
			</label>

			<ColorInput id={id} color={color} onChange={onChangeColor}>
				{renderIf(hasPixelPicker)(() => (
					<ToggleButton
						pressed={isPickingPixel}
						onPress={onPickPixel}
						title={intl.formatMessage({
							id: 'ColorInput.pickPixelButton.title'
						})}
					>
						<Icon name="eyedropper" />
					</ToggleButton>
				))}

				{renderIf(hasTextPicker)(() => (
					<ToggleButton
						pressed={isPickingText}
						onClick={onPickText}
						title={intl.formatMessage({
							id: 'ColorInput.pickTextButton.title'
						})}
					>
						<Icon name="cursor" />
					</ToggleButton>
				))}
			</ColorInput>
		</div>
	);
};

ColorContrastField.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	hasPixelPicker: PropTypes.bool.isRequired,
	hasTextPicker: PropTypes.bool.isRequired,
	isPickingPixel: PropTypes.bool.isRequired,
	isPickingText: PropTypes.bool.isRequired,
	onPickPixel: PropTypes.func.isRequired,
	onPickText: PropTypes.func.isRequired,
	onChangeColor: PropTypes.func.isRequired
};

export default ColorContrastField;
