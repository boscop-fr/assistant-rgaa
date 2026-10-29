import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {fetchCurrentTab, getTabId, onTabMount} from '../common/utils/tabs';
import {browser} from '../common/utils/webExtension';
import {getOption} from '../options/utils/storage';
import App from './components/App';
import messages from './messages/fr';
import {
	loadReference,
	loadTab,
	pauseAutoSave,
	setLoadError
} from './slices/app';
import {setTabIds} from './slices/panel';
import {storeState} from './slices/storage';
import {createStore} from './store';
import {subscribeToBrowserEvents} from './subscriptions';

const init = async () => {
	const query = new URLSearchParams(window.location.search);
	const tabIdParam = query.get('tabId');
	const targetTabId = tabIdParam ? Number.parseInt(tabIdParam, 10) : null;

	const currentTab = await fetchCurrentTab();
	const popupTabId = targetTabId ? getTabId(currentTab) : null;
	const targetTab = targetTabId
		? await browser.tabs.get(targetTabId)
		: currentTab;

	const store = createStore();
	subscribeToBrowserEvents(store);

	store.dispatch(
		setTabIds({
			targetTabId: getTabId(targetTab),
			popupTabId
		})
	);

	const version = await getOption('referenceVersion');
	await store.dispatch(loadReference(version)).unwrap();

	onTabMount(getTabId(targetTab), () => {
		store.dispatch(pauseAutoSave(true));
		store
			.dispatch(loadTab())
			.unwrap()
			.then(() => {
				store.dispatch(setLoadError(false));
				store.dispatch(pauseAutoSave(false));
			})
			.catch((e) => {
				// The auto save stays paused, which prevents
				// saving the state of the previous page under the
				// key of the current one.
				console.error(e);
				store.dispatch(setLoadError(true));
			});

		return () => {
			store.dispatch(storeState());
		};
	});

	const root = createRoot(document.getElementById('panel') as HTMLElement);
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
