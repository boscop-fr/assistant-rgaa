import {useEffect} from 'react';
import {type Runtime} from 'webextension-polyfill';

export const keepRuntimeConnectionAlive = (tabId: number) => {
	let port: Runtime.Port = null;

	const openPort = () => {
		try {
			port = browser.runtime.connect({
				name: `${tabId}`
			});
		} catch (e) {
			console.error(e);
		}
	};

	// We're keeping the connection alive by sending regular
	// pings to the other end.
	// The service worker being interruptable at any moment,
	// the connexion is inherently unstable by default.
	// If we're getting disconnected anyway, we're reopening
	// the connexion.
	setInterval(async () => {
		try {
			await port?.postMessage('KEEPALIVE');
		} catch (e) {
			console.error(e);
			port = null;
			openPort();
		}
	}, 5000);
};

export const sendMessage = browser.runtime.sendMessage;

export const useRuntimeMessage = (
	listener: Parameters<typeof browser.runtime.onMessage.addListener>[0]
) => {
	useEffect(() => {
		browser.runtime.onMessage.addListener(listener);

		return () => {
			browser.runtime.onMessage.removeListener(listener);
		};
	}, []);
};
