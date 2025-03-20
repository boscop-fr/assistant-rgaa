import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import type {JSX} from 'react/jsx-runtime';
import type {Options} from '../utils/storage';
import {
	DEFAULT_OPTIONS,
	getAllOptions,
	isBooleanOption,
	setAllOptions
} from '../utils/storage';

const VERSIONS = [
	{name: 'RGAA 4.1.2 (2023)', version: '4-2023'},
	{name: 'RGAA 4.1 (2021)', version: '4-2021'},
	{name: 'RGAA 4.0 (2019)', version: '4-2019'},
	{name: 'RGAA 3-2017', version: '3-2017'},
	{name: 'RGAA 3-2016', version: '3-2016'}
];

function OptionsForm() {
	const [isSuccess, setSuccess] = useState(false);
	const [options, setOptions] = useState(DEFAULT_OPTIONS);

	useEffect(() => {
		getAllOptions().then(setOptions);
	}, []);

	const handleChange = (
		event: JSX.TargetedEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const {name, value, checked} = event.currentTarget as HTMLInputElement;

		setOptions((current) => ({
			...current,
			[name]: isBooleanOption(name as keyof Options) ? checked : value
		}));

		setSuccess(false);
	};

	const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
		const data = new FormData(event.currentTarget);
		event.preventDefault();

		setAllOptions(
			Object.fromEntries(
				Object.keys(options).map((name) => [
					name,
					isBooleanOption(name as keyof Options)
						? data.has(name)
						: data.get(name)?.toString()
				])
			) as Options
		);

		setSuccess(true);
	};

	return (
		<form className="OptionsForm" onSubmit={handleSubmit}>
			<table role="presentation">
				<tr>
					<td>
						<label htmlFor="OptionsForm-input--referenceVersion">
							<FormattedMessage id="OptionsForm.referenceVersion" />
						</label>
					</td>
					<td>
						<select
							id="OptionsForm-input--referenceVersion"
							name="referenceVersion"
							value={options.referenceVersion}
							onChange={handleChange}
						>
							{VERSIONS.map((ref) => (
								<option key={`ref-${ref.version}`} value={ref.version}>
									{ref.name}
								</option>
							))}
						</select>
					</td>
				</tr>

				<tr>
					<td>
						<label htmlFor="OptionsForm-input--allowMultipleTests">
							<FormattedMessage id="OptionsForm.allowMultipleTests" />
						</label>
					</td>
					<td>
						<input
							id="OptionsForm-input--allowMultipleTests"
							type="checkbox"
							name="allowMultipleTests"
							value="true"
							checked={options.allowMultipleTests}
							onChange={handleChange}
						/>
					</td>
				</tr>

				<tr>
					<td>
						<label htmlFor="OptionsForm-input--autoOpenInstructions">
							<FormattedMessage id="OptionsForm.autoOpenInstructions" />
						</label>
					</td>
					<td>
						<input
							id="OptionsForm-input--autoOpenInstructions"
							type="checkbox"
							name="autoOpenInstructions"
							value="true"
							checked={options.autoOpenInstructions}
							onChange={handleChange}
						/>
					</td>
				</tr>

				<tr
					// biome-ignore lint/a11y/useSemanticElements:
					role="group"
					aria-labelledby="OptionsForm-statePersistence-label"
					aria-describedby="OptionsForm-statePersistence-hint"
				>
					<td>
						<p id="OptionsForm-statePersistence-label">
							<FormattedMessage id="OptionsForm.statePersistence" />
						</p>

						<p
							className="OptionsForm-hint"
							id="OptionsForm-statePersistence-hint"
						>
							<FormattedMessage id="OptionsForm.statePersistence.hint" />
						</p>
					</td>
					<td>
						{['always', 'tab', 'url', 'tabUrl'].map((option) => {
							const id = `OptionsForm-input--statePersistence-${option}`;

							return (
								<div className="OptionsForm-field--inline" key={option}>
									<input
										id={id}
										type="radio"
										name="statePersistence"
										value={option}
										checked={options.statePersistence === option}
										onChange={handleChange}
									/>

									<label htmlFor={id}>
										<FormattedMessage
											id={`OptionsForm.statePersistence.${option}`}
										/>
									</label>
								</div>
							);
						})}
					</td>
				</tr>

				<tr>
					<td />
					<td>
						<button type="submit">
							<FormattedMessage id="OptionsForm.submit" />
						</button>

						{isSuccess ? (
							<p className="OptionsForm-success">
								<FormattedMessage id="OptionsForm.successMessage" />
							</p>
						) : null}
					</td>
				</tr>
			</table>
		</form>
	);
}

export default OptionsForm;
