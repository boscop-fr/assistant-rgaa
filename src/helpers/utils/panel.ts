import type {Runtime} from 'webextension-polyfill';
import {PANEL_PORT} from '../../background/slices/runtime';
import {browser} from '../../common/utils/webExtension';

// Port opened by the panel auditing this tab.
let panelPort: Runtime.Port | null = null;

// Handles messages from the panel. The latest panel to
// connect replaces any previous one, and `onLeave` is called
// when it disconnects (i.e. it was closed).
export const listenToPanel = (
	handle: (message: unknown) => void,
	onLeave: () => void
) => {
	browser.runtime.onConnect.addListener((port) => {
		if (port.name !== PANEL_PORT) {
			return;
		}

		panelPort = port;
		port.onMessage.addListener(handle);
		port.onDisconnect.addListener(() => {
			if (panelPort === port) {
				panelPort = null;
				onLeave();
			}
		});
	});
};

export const sendToPanel = (message: unknown) => {
	panelPort?.postMessage(message);
};
