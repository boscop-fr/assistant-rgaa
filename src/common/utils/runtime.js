import {isEmpty} from 'lodash';
import {useEffect} from 'react';
import {INVALID_RESPONSE} from '../../background/slices/runtime';

export const sendMessage = async (message, options = {}) => {
	const response = await browser.runtime.sendMessage(message, options);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

export const createMessageHandler =
	(handler) =>
	// eslint-disable-next-line consistent-return
	(message, sender, sendResponse) => {
		const response = handler(message, sender);

		if (response instanceof Promise) {
			response.then(sendResponse);
			return true;
		}

		if (!isEmpty(response)) {
			sendResponse(response);
		}
	};

export const useRuntimeMessage = (callback) => {
	useEffect(() => {
		const handler = createMessageHandler(callback);
		browser.runtime.onMessage.addListener(handler);

		return () => {
			browser.runtime.onMessage.removeListener(handler);
		};
	}, []);
};
