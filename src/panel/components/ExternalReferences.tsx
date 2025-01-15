import React from 'react';
import {useIntl} from 'react-intl';
import {CriterionReferences} from '../../common/types';

type ExternalReferencesProps = {
	references: CriterionReferences;
};

function ExternalReferences({references}: ExternalReferencesProps) {
	const intl = useIntl();

	if (!references.wcag) {
		return;
	}

	return (
		<div className="ExternalReferences">
			<div className="ExternalReferences-section">
				<h3 className="ExternalReferences-sectionTitle">
					<abbr
						lang="en"
						title={intl.formatMessage({
							id: 'ExternalReferences.wcag.abbr'
						})}
					>
						WCAG
					</abbr>
				</h3>

				{Object.entries(references.wcag).map(([type, text]) => (
					<div className="ExternalReferences-subSection" key={type}>
						<h4 className="ExternalReferences-subSectionTitle">
							{intl.formatMessage({
								id: `ExternalReferences.wcag.${type}`
							})}
						</h4>

						<div
							className="ExternalReferences-subSectionBody"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{__html: text}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default ExternalReferences;
