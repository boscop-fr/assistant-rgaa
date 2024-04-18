import {type JSX} from 'react/jsx-runtime';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import versions from '../../../data/versions.json';
import {
	DEFAULT_OPTIONS,
	Options,
	getAllOptions,
	setAllOptions
} from '../utils/storage';

function OptionsForm() {
	const [isSuccess, setSuccess] = useState(false);
	const [options, setOptions] = useState(DEFAULT_OPTIONS);

	useEffect(() => {
		getAllOptions().then(setOptions);
	}, []);

	const handleChange = (
		event: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const {name, value} = event.currentTarget;
		setOptions((current) => ({
			...current,
			[name]: value
		}));
		setSuccess(false);
	};

	const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setAllOptions(Object.fromEntries(data.entries()) as unknown as Options);
		setSuccess(true);
	};

	return (
		<form onSubmit={handleSubmit} className="OptionsForm">
			<div className="OptionsForm-field">
				<label
					className="OptionsForm-label"
					htmlFor="OptionsForm-input--referenceVersion"
				>
					<FormattedMessage id="OptionsForm.referenceVersion" />
					{'' /* forces eslint to consider that the label has some text */}
				</label>

				<select
					id="OptionsForm-input--referenceVersion"
					name="referenceVersion"
					value={options.referenceVersion}
					onChange={handleChange}
				>
					{versions.map((ref) => (
						<option key={`ref-${ref.version}`} value={ref.version}>
							{ref.name}
						</option>
					))}
				</select>
			</div>

			<div className="OptionsForm-submit">
				<button type="submit">
					<FormattedMessage id="OptionsForm.submit" />
				</button>
			</div>

			{isSuccess ? (
				<p className="OptionsForm-success">
					<FormattedMessage id="OptionsForm.successMessage" />
				</p>
			) : null}
		</form>
	);
}

export default OptionsForm;
