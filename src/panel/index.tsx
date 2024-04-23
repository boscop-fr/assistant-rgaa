import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {tabLoaded} from '../background/slices/runtime';
import {keepRuntimeConnectionAlive, sendMessage} from '../common/utils/runtime';
import {
	fetchCurrentTab,
	getTabState,
	onTabReloaded
} from '../common/utils/tabs';
import {getOption} from '../options/utils/storage';
import App from './components/App';
import messages from './messages/fr';
import {setPageInfo} from './slices/panel';
import {setVersion} from './slices/reference';
import {createStore} from './store';

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
	keepRuntimeConnectionAlive(targetTab.id);

	onTabReloaded(targetTab.id, () => {
		sendMessage(
			tabLoaded({
				tabId: targetTab.id
			})
		);
	});

	const state = await getTabState(targetTab.id);
	const store = createStore(state);

	store.dispatch(setVersion(await getOption('referenceVersion')));

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
				<App />
			</IntlProvider>
		</Provider>
	);

	root.render(app);
};

init();
