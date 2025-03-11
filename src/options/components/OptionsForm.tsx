import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {type JSX} from 'react/jsx-runtime';
import versions from '../../../data/versions.json';
import type {Options} from '../utils/storage';
import {
	DEFAULT_OPTIONS,
	getAllOptions,
	isBooleanOption,
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

			<div className="OptionsForm-field OptionsForm-field--inline">
				<input
					id="OptionsForm-input--allowMultipleTests"
					type="checkbox"
					name="allowMultipleTests"
					value="true"
					checked={options.allowMultipleTests}
					onChange={handleChange}
				/>

				<label
					className="OptionsForm-label"
					htmlFor="OptionsForm-input--allowMultipleTests"
				>
					<FormattedMessage id="OptionsForm.allowMultipleTests" />
					{'' /* forces eslint to consider that the label has some text */}
				</label>
			</div>

			<div className="OptionsForm-field OptionsForm-field--inline">
				<input
					id="OptionsForm-input--autoOpenInstructions"
					type="checkbox"
					name="autoOpenInstructions"
					value="true"
					checked={options.autoOpenInstructions}
					onChange={handleChange}
				/>

				<label
					className="OptionsForm-label"
					htmlFor="OptionsForm-input--autoOpenInstructions"
				>
					<FormattedMessage id="OptionsForm.autoOpenInstructions" />
					{'' /* forces eslint to consider that the label has some text */}
				</label>
			</div>

			<fieldset className="OptionsForm-field">
				<legend className="OptionsForm-label">
					<FormattedMessage id="OptionsForm.statePersistence" />
				</legend>

				<p className="OptionsForm-hint">
					<FormattedMessage id="OptionsForm.statePersistence.hint" />
				</p>

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

							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label htmlFor={id}>
								<FormattedMessage
									id={`OptionsForm.statePersistence.${option}`}
								/>
							</label>
						</div>
					);
				})}
			</fieldset>

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
