import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import browser from 'webextension-polyfill';
import {fetchCurrentTab, onTabMount} from '../common/utils/tabs';
import {getOption} from '../options/utils/storage';
import App from './components/App';
import messages from './messages/fr';
import {loadReference, loadTab, setLoading} from './slices/app';
import {setTabIds} from './slices/panel';
import {storeState} from './slices/storage';
import {createStore} from './store';

const init = async () => {
	const query = new URLSearchParams(window.location.search);
	const targetTabId = query.has('tabId')
		? Number.parseInt(query.get('tabId'), 10)
		: null;

	const currentTab = await fetchCurrentTab();
	const popupTabId = targetTabId ? currentTab.id : null;
	const targetTab = targetTabId
		? await browser.tabs.get(targetTabId)
		: currentTab;

	const store = createStore();

	store.dispatch(
		setTabIds({
			targetTabId: targetTab.id,
			popupTabId
		})
	);

	const version = await getOption('referenceVersion');
	await store.dispatch(loadReference(version)).unwrap();

	onTabMount(targetTab.id, () => {
		store.dispatch(setLoading(true));
		store
			.dispatch(loadTab())
			.unwrap()
			.then(() => {
				store.dispatch(setLoading(false));
			});

		return () => {
			store.dispatch(storeState());
		};
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
