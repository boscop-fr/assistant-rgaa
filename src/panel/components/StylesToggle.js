import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';
import Icon from './Icon';

const StylesToggle = ({areStylesEnabled, toggleStyles}) => {
	const intl = useIntl();

	return (
		<button
			className="ActionButton"
			type="button"
			onClick={() => toggleStyles(!areStylesEnabled)}
			title={intl.formatMessage({
				id: `ReferencePage.styles.toggle.disabled.${
					areStylesEnabled ? 'false' : 'true'
				}`
			})}
		>
			{areStylesEnabled ? <Icon name="visible" /> : <Icon name="hidden" />}
			<FormattedMessage id="ReferencePage.styles.toggle.label" />
		</button>
	);
};

StylesToggle.propTypes = {
	areStylesEnabled: PropTypes.bool.isRequired,
	toggleStyles: PropTypes.func.isRequired
};

export default StylesToggle;
