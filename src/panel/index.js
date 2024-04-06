import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {tabReloaded} from '../background/slices/runtime';
import {
	fetchCurrentTab,
	getTabState,
	onTabReloaded
} from '../common/utils/tabs';
import {OPTIONS, getOption} from '../options/utils/storage';
import createStore from './createStore';
import messages from './messages/fr';
import routes from './routes';
import {setPageInfo} from './slices/panel';
import {setVersion} from './slices/reference';
import {DEFAULT_VERSION} from './utils/reference';

const init = async () => {
	const query = new URLSearchParams(window.location.search);
	const targetTabId = query.has('tabId')
		? parseInt(query.get('tabId'), 10)
		: null;

	const currentTab = await fetchCurrentTab();
	const popupTabId = targetTabId ? currentTab.id : null;
	const targetTab = targetTabId
		? await browser.tabs.get(targetTabId)
		: currentTab;

	// Used to observe the panel's lifecycle.
	// @see https://stackoverflow.com/a/77106777/2391359
	const port = browser.runtime.connect({
		name: `${targetTab.id}`
	});

	onTabReloaded(targetTab.id, () => {
		port.postMessage(tabReloaded());
	});

	const state = await getTabState(targetTab.id);
	const store = createStore(state);

	store.dispatch(
		setVersion(await getOption(OPTIONS.referenceVersion, DEFAULT_VERSION))
	);

	store.dispatch(
		setPageInfo({
			tabId: targetTab.id,
			url: targetTab.url,
			title: targetTab.title,
			popupTabId
		})
	);

	const root = createRoot(document.getElementById('panel'));
	const app = (
		<Provider store={store}>
			<IntlProvider locale="fr" messages={messages}>
				{routes(store)}
			</IntlProvider>
		</Provider>
	);

	root.render(app);
};

init();
