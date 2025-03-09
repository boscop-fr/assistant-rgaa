import {useEffect} from 'preact/hooks';
import {tabAction} from '../../background/slices/runtime';

export const useTabAction = (
	tabId: number,
	listener: (message: unknown) => void
) => {
	const handleMessage = (message: unknown) => {
		if (tabAction.match(message) && message.payload.tabId === tabId) {
			listener(message.payload.action);
		}
	};

	useEffect(() => {
		browser.runtime.onMessage.addListener(handleMessage);

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);
};
