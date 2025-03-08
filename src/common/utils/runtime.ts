import {useEffect} from 'react';

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
