import React from 'react';
import {useIntl} from 'react-intl';
import {
	CriterionReference,
	CriterionTechniquesReference,
	CriterionWcagReference
} from '../../common/types';

type ExternalReferencesProps = {
	refLinks: CriterionReference[];
};

function ExternalReferences({refLinks}: ExternalReferencesProps) {
	const intl = useIntl();

	return (
		<div className="References-container">
			<div className="Wcag-success">
				<h3 className="Wcag-success--header">
					<abbr lang="en" title={intl.formatMessage({id: 'Wcag.abbr'})}>
						WCAG
					</abbr>{' '}
					2.1
				</h3>

				<p>{intl.formatMessage({id: 'Critererion.success'})}</p>

				{refLinks.map(({wcag}: CriterionWcagReference, i) => (
					<div
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{__html: wcag}}
					/>
				))}

				<p>{intl.formatMessage({id: 'Wcag.techniques.sucess'})}</p>

				{refLinks.map(({techniques}: CriterionTechniquesReference, i) => (
					<div
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{__html: techniques}}
					/>
				))}
			</div>
		</div>
	);
}

export default ExternalReferences;
