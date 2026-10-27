import browser, {type Runtime} from 'webextension-polyfill';
import {PANEL_PORT} from '../../background/slices/runtime';

// Port opened by the panel auditing this tab.
let panelPort: Runtime.Port | null = null;

// Handles messages from the panel. The latest panel to
// connect replaces any previous one.
export const listenToPanel = (handle: (message: unknown) => void) => {
	browser.runtime.onConnect.addListener((port) => {
		if (port.name !== PANEL_PORT) {
			return;
		}

		panelPort = port;
		port.onMessage.addListener(handle);
		port.onDisconnect.addListener(() => {
			if (panelPort === port) {
				panelPort = null;
			}
		});
	});
};

export const sendToPanel = (message: unknown) => {
	panelPort?.postMessage(message);
};
