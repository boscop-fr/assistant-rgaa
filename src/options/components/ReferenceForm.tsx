import {type JSX} from 'react/jsx-runtime';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import versions from '../../../data/versions.json';
import {DEFAULT_VERSION} from '../../panel/utils/reference';
import {OPTIONS, getOption, setOption} from '../utils/storage';

function ReferenceForm() {
	const [isSuccess, setSuccess] = useState(false);
	const [selectedVersion, setSelectedVersion] = useState(DEFAULT_VERSION);

	useEffect(() => {
		getOption(OPTIONS.referenceVersion, DEFAULT_VERSION).then(
			setSelectedVersion
		);
	}, []);

	const onSelectChange = (event: JSX.TargetedEvent<HTMLSelectElement>) => {
		setSelectedVersion(event.currentTarget.value);
		setSuccess(false);
	};

	const onFormSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
		event.preventDefault();
		setOption(OPTIONS.referenceVersion, selectedVersion);
		setSuccess(true);
	};

	return (
		<form onSubmit={onFormSubmit} className="Options-references">
			<div className="Options-field">
				<label htmlFor="Options-referencesSelect">
					<FormattedMessage id="Options.references.label" />
					{'' /* forces eslint to consider that the label has some text */}
				</label>

				<select
					name="references"
					id="Options-referencesSelect"
					value={selectedVersion}
					onChange={onSelectChange}
				>
					{versions.map((ref) => (
						<option key={`ref-${ref.version}`} value={ref.version}>
							{ref.name}
						</option>
					))}
				</select>
			</div>
			<div className="Options-submit">
				<button type="submit">
					<FormattedMessage id="Options.references.submit" />
				</button>
			</div>

			{isSuccess ? (
				<p className="Options-success">
					<FormattedMessage id="Options.references.successMessage" />
				</p>
			) : null}
		</form>
	);
}

export default ReferenceForm;
