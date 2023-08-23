import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import renderIf from 'render-if';
import {useDispatch, useSelector} from 'react-redux';
import {setReferenceVersion} from '../../common/actions/reference';
import {reset as resetImport} from '../../common/actions/imports';
import {getReferencesList, DEFAULT_VERSION} from '../../common/api/reference';
import {getVersion} from '../../common/selectors/reference';

/**
 *
 */
function ReferenceForm() {
	const version = useSelector(getVersion);
	const references = useSelector(getReferencesList);
	const dispatch = useDispatch();

	const [selectedVersion, setSelectedVersion] = useState(
		version || DEFAULT_VERSION
	);
	const [isSuccess, setSuccess] = useState(false);

	const onSelectChange = (event) => {
		setSelectedVersion(event.target.value);
		setSuccess(false);
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		dispatch(resetImport());
		dispatch(setReferenceVersion(selectedVersion));
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
					{references.map((ref) => (
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
