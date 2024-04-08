import React from 'react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import messages from '../panel/messages/fr';
import ReferenceForm from './components/ReferenceForm';

const root = createRoot(document.getElementById('options'));
const app = (
	<IntlProvider locale="fr" messages={messages}>
		<ReferenceForm />
	</IntlProvider>
);

root.render(app);
