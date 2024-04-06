import React from 'react';
import {useSelector} from 'react-redux';
import {createTab, viewPageSource} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/runtime';
import {isFirefox} from '../../common/utils/browser';
import {selectPageUrl} from '../../panel/slices/panel';
import HelperButton from './HelperButton';

const ViewSource = () => {
	const tabUrl = useSelector(selectPageUrl);

	const handleViewSource = () => {
		// On Firefox, we're opening a home-made page showing
		// the source code as we can't open the `view-source`
		// page directly.
		// @TODO Move logic to the background script.
		sendMessage(
			isFirefox(window.navigator.userAgent)
				? viewPageSource({
						url: tabUrl
				  })
				: createTab({
						url: `view-source:${tabUrl}`
				  })
		);
	};

	return <HelperButton name="Voir les sources" onClick={handleViewSource} />;
};

export default ViewSource;
