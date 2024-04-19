import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import OptionsForm from './components/OptionsForm';
import messages from './messages/fr';

const root = createRoot(document.getElementById('options'));
const app = (
	<IntlProvider locale="fr" messages={messages}>
		<OptionsForm />
	</IntlProvider>
);

root.render(app);
