import {useEffect} from 'react';

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
