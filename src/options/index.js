import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl';
import messages from '../common/messages/fr';
import getStore from './getStore';
import App from './components/App';

getStore()
	.then((store) => (
		<Provider store={store}>
			<IntlProvider locale="fr" messages={messages}>
				<App />
			</IntlProvider>
		</Provider>
	))
	.then((app) => createRoot(document.getElementById('options')).render(app))
	.catch(() => {});
