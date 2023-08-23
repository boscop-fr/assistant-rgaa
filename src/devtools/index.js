import React from 'react';
import {createRoot} from 'react-dom/client';
import store from './store';
import DevTools from './components/DevTools';

/**
 *
 */
createRoot(document.getElementById('devtools')).render(
	<DevTools store={store} />
);
