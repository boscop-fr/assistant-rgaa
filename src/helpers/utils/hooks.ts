import {useCallback, useEffect} from 'preact/hooks';
import browser from 'webextension-polyfill';
import {tabAction} from '../../background/slices/runtime';

export const useTabAction = (
	tabId: number,
	listener: (message: unknown) => void
) => {
	const handleMessage = useCallback(
		(message: unknown) => {
			if (tabAction.match(message) && message.payload.tabId === tabId) {
				listener(message.payload.action);
			}
		},
		[tabId, listener]
	);

	useEffect(() => {
		browser.runtime.onMessage.addListener(handleMessage);

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage);
		};
	}, [handleMessage]);
};
