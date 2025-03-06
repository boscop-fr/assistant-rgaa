import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';
import {useIntl} from 'react-intl';
import {type JSX} from 'react/jsx-runtime';
import {cssToHex} from '../../common/utils/color';

const isValidColor = (color: string) => {
	try {
		cssToHex(color);
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
	const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) =>
		onChange(event.currentTarget.value);

	const isInvalid = !isValidColor(color);
	const className = classNames({
		'Form-input': true,
		'is-invalid': isInvalid
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
