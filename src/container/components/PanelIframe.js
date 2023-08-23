import React from 'react';
import {useIntl} from 'react-intl';
import {IFRAME_FILE, CONTAINER_ID} from '../api/container';

/**
 *
 */
function PanelIframe() {
	const intl = useIntl();
	const IFRAME_SRC = browser.runtime.getURL(IFRAME_FILE);

	return (
		<iframe
			src={IFRAME_SRC}
			className={`${CONTAINER_ID}-panel`}
			title={intl.formatMessage({
				id: 'PanelIframe.title'
			})}
			style={{
				display: 'block'
			}}
		/>
	);
}

export default PanelIframe;
