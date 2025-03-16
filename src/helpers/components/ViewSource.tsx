import React from 'react';
import browser from 'webextension-polyfill';
import {createTab, viewPageSource} from '../../background/slices/runtime';
import {isFirefox} from '../../common/utils/browser';
import {selectTargetTabUrl} from '../../panel/slices/panel';
import {useAppSelector} from '../../panel/utils/hooks';
import HelperButton from './HelperButton';

const ViewSource = () => {
	const tabUrl = useAppSelector(selectTargetTabUrl);

	const handleViewSource = () => {
		// On Firefox, we're opening a home-made page showing
		// the source code as we can't open the `view-source`
		// page directly.
		// @TODO Move logic to the background script.
		browser.runtime.sendMessage(
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
