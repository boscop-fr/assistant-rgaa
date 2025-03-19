import {PipetteIcon, TextCursorIcon} from 'lucide-react';
import React from 'react';
import {useIntl} from 'react-intl';
import Icon from '../../panel/components/Icon';
import ColorInput from './ColorInput';
import ToggleButton from './ToggleButton';

type ColorContrastFieldProps = {
	name: string;
	label: string;
	color: string;
	hasPixelPicker: boolean;
	hasTextPicker: boolean;
	isPickingPixel: boolean;
	isPickingText: boolean;
	onPickPixel: () => void;
	onPickText: () => void;
	onChangeColor: (color: string) => void;
};

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
}: ColorContrastFieldProps) => {
	const intl = useIntl();
	const id = `ColorContrastField--${name}`;

	return (
		<div className="Form-field" key={name}>
			<label className="Form-label" htmlFor={id}>
				{label}
			</label>

			<ColorInput id={id} color={color} onChange={onChangeColor}>
				{hasPixelPicker ? (
					<ToggleButton
						pressed={isPickingPixel}
						onPress={onPickPixel}
						title={intl.formatMessage({
							id: 'ColorInput.pickPixelButton.title'
						})}
					>
						<Icon icon={PipetteIcon} />
					</ToggleButton>
				) : null}

				{hasTextPicker ? (
					<ToggleButton
						pressed={isPickingText}
						onClick={onPickText}
						title={intl.formatMessage({
							id: 'ColorInput.pickTextButton.title'
						})}
					>
						<Icon icon={TextCursorIcon} />
					</ToggleButton>
				) : null}
			</ColorInput>
		</div>
	);
};

export default ColorContrastField;
