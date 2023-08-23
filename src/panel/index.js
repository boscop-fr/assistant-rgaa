import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl';
import routes from './routes';
import getStore from './getStore';
import messages from '../common/messages/fr';

getStore()
	.then((store) => (
		<Provider store={store}>
			<IntlProvider locale="fr" messages={messages}>
				{routes(store)}
			</IntlProvider>
		</Provider>
	))
	.then((app) => createRoot(document.getElementById('panel')).render(app));
