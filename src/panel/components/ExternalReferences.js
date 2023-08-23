import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

function ExternalReferences({refLinks, intl}) {
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
				{refLinks.map(({wcag}, i) => (
					<div
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{__html: wcag}}
					/>
				))}
				<p>{intl.formatMessage({id: 'Wcag.techniques.sucess'})}</p>
				{refLinks.map(({techniques}, i) => (
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

ExternalReferences.propTypes = {
	refLinks: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
		.isRequired,
	intl: intlShape.isRequired
};

export default injectIntl(ExternalReferences);
