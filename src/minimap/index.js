import React from 'react';
import {createRoot} from 'react-dom/client';
import {tabUnloaded} from '../common/slices/runtime';
import MinimapContainer from './components/MinimapContainer';

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<MinimapContainer />);

browser.runtime.onMessage.addListener((action) => {
	if (tabUnloaded.match(action)) {
		root.unmount();
		container.remove();
	}
});
