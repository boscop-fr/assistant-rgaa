import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import renderIf from 'render-if';
import {getOption, OPTIONS, setOption} from '../../common/api/options';
import {DEFAULT_VERSION, getReferencesList} from '../../common/api/reference';

/**
 *
 */
function ReferenceForm() {
	const [isSuccess, setSuccess] = useState(false);
	const [selectedVersion, setSelectedVersion] = useState(
		getOption(OPTIONS.referenceVersion, DEFAULT_VERSION)
	);

	const onSelectChange = (event) => {
		setSelectedVersion(event.target.value);
		setSuccess(false);
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		setOption(OPTIONS.referenceVersion, selectedVersion);
		setSuccess(true);
	};

	return (
		<form onSubmit={onFormSubmit} className="Options-references">
			<div className="Options-field">
				<label htmlFor="Options-referencesSelect">
					<FormattedMessage id="Options.references.label" />
				</label>
				<select
					name="references"
					id="Options-referencesSelect"
					value={selectedVersion}
					onChange={onSelectChange}
				>
					{getReferencesList().map((ref) => (
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
			{renderIf(isSuccess)(() => (
				<p className="Options-success">
					<FormattedMessage id="Options.references.successMessage" />
				</p>
			))}
		</form>
	);
}

export default ReferenceForm;
