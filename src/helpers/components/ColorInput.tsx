import classNames from 'classnames';
import createColor from 'color';
import React, {ChangeEventHandler, PropsWithChildren} from 'react';
import {useIntl} from 'react-intl';

const isValidColor = (color: string) => {
	try {
		createColor(color);
		return true;
	} catch (e) {
		return false;
	}
};

type ColorInputProps = PropsWithChildren<{
	id: string;
	color: string;
	onChange: (color: string) => void;
}>;

const ColorInput = ({id, color, onChange, children}: ColorInputProps) => {
	const intl = useIntl();
	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
		onChange(event.target.value);

	const isInvalid = !isValidColor(color);
	const className = classNames({
		'Form-input': true,
		isInvalid
	});

	return (
		<div className="ColorInput">
			<input
				type="text"
				id={id}
				className={className}
				aria-invalid={isInvalid}
				title={
					isInvalid
						? intl.formatMessage({
								id: 'ColorInput.invalidFormatError'
						  })
						: null
				}
				value={color}
				onChange={handleChange}
			/>

			<div
				className="ColorInput-sample"
				aria-hidden="true"
				title={intl.formatMessage({
					id: 'ColorInput.sample'
				})}
				style={{
					backgroundColor: color
				}}
			/>

			{children}
		</div>
	);
};

export default ColorInput;
