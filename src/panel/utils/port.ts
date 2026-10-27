import browser, {type Runtime} from 'webextension-polyfill';
import {PANEL_PORT} from '../../background/slices/runtime';

type Listener = (message: unknown) => void;

// Port to the content scripts of the target tab. It is
// closed when the tab navigates, and opened again once
// content scripts are injected in the new page.
let port: Runtime.Port | null = null;

// Listeners are kept here rather than on the port, so they
// survive reconnections.
const listeners = new Set<Listener>();

export const connectToTab = (tabId: number) => {
	port?.disconnect();

	const newPort = browser.tabs.connect(tabId, {name: PANEL_PORT});
	newPort.onMessage.addListener((message: unknown) => {
		for (const listener of listeners) {
			listener(message);
		}
	});

	newPort.onDisconnect.addListener(() => {
		if (port === newPort) {
			port = null;
		}
	});

	port = newPort;
};

// Messages are dropped while disconnected, as the whole
// state is sent again on connection.
export const sendToTab = (message: unknown) => {
	port?.postMessage(message);
};

export const onTabMessage = (listener: Listener) => {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
};
