import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import messages from './messages/fr';
import OptionsForm from './components/OptionsForm';

const root = createRoot(document.getElementById('options'));
const app = (
	<IntlProvider locale="fr" messages={messages}>
		<OptionsForm />
	</IntlProvider>
);

root.render(app);
