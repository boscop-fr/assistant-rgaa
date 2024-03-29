import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {setPageInfo} from '../common/actions/panel';
import {setReferenceVersion} from '../common/actions/reference';
import {getOption, OPTIONS} from '../common/api/options';
import {DEFAULT_VERSION} from '../common/api/reference';
import {fetchCurrentTab, getTabState} from '../common/api/tabs';
import createStore from '../common/createStore';
import messages from '../common/messages/fr';
import reducer from '../common/reducers';
import sagas from '../common/sagas';
import routes from './routes';

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
	browser.runtime.connect({
		name: `${targetTab.id}`
	});

	const state = await getTabState(targetTab.id);
	const store = createStore(reducer, sagas, state);

	store.dispatch(
		setReferenceVersion(
			await getOption(OPTIONS.referenceVersion, DEFAULT_VERSION)
		)
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
