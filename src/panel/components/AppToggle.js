import React from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

/**
 *
 */
function AppToggle({onClick}) {
	const intl = useIntl();

	return (
		<button
			type="button"
			className="AppToggle"
			onClick={onClick}
			title={intl.formatMessage({id: 'Panel.toggle'})}
		>
			<img
				src={browser.extension.getURL('img/icon-48.png')}
				alt={intl.formatMessage({id: 'Panel.toggle'})}
			/>
		</button>
	);
}

AppToggle.propTypes = {
	onClick: PropTypes.func.isRequired
};

export default AppToggle;
