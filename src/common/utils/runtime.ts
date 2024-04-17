import {useEffect} from 'react';
import {type Runtime} from 'webextension-polyfill';
import {INVALID_RESPONSE} from '../../background/slices/runtime';

export const sendMessage = async <T, U = void>(
	message: T,
	options: Runtime.SendMessageOptionsType = {}
): Promise<U> => {
	const response = await browser.runtime.sendMessage(message, options);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

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
