import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {appLoaded, syncHelpers} from '../background/slices/runtime';
import {
	fetchCurrentTab,
	getTabState,
	onTabReloaded
} from '../common/utils/tabs';
import {getOption} from '../options/utils/storage';
import App from './components/App';
import messages from './messages/fr';
import {revertActiveHelpers} from './slices/helpers';
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

	// Applies previously set helpers if any were persisted
	// before.
	store.dispatch(syncHelpers());

	window.addEventListener('visibilitychange', () => {
		switch (document.visibilityState) {
			// Reverts helpers when the panel is closed or
			// hidden. We're relying on this because there
			// no event to tell when the panel is open or
			// closed. This requires more work as helpers
			// are applied or reverted each time the user
			// switches tab, but it is the only reliable
			// method.
			case 'hidden':
				browser.tabs.sendMessage(targetTab.id, revertActiveHelpers());
				break;

			// Reapplies helpers when the panel becomes
			// visible again.
			case 'visible':
				store.dispatch(syncHelpers());
				break;
		}
	});

	onTabReloaded(targetTab.id, () => {
		browser.runtime.sendMessage(
			appLoaded({
				tabId: targetTab.id
			})
		);
	});

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
