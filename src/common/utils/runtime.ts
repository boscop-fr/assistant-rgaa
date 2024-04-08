import {isEmpty} from 'lodash';
import {useEffect} from 'react';
import {type Runtime} from 'webextension-polyfill';
import {INVALID_RESPONSE} from '../../background/slices/runtime';

export const sendMessage = async <T>(
	message: any,
	options: Runtime.SendMessageOptionsType = {}
): Promise<T> => {
	const response = await browser.runtime.sendMessage(message, options);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

type MessageHandlerCallback<T> = (
	message: T,
	sender: Runtime.MessageSender
) => Promise<any> | void;

export const createMessageHandler =
	<T>(handler: MessageHandlerCallback<T>) =>
	(
		message: any,
		sender: Runtime.MessageSender,
		sendResponse: (response: any) => void
	): true | void | Promise<any> => {
		const response = handler(message, sender);

		if (response instanceof Promise) {
			response.then(sendResponse);
			return true;
		}

		if (!isEmpty(response)) {
			sendResponse(response);
		}
	};

export const useRuntimeMessage = <T>(callback: MessageHandlerCallback<T>) => {
	useEffect(() => {
		const handler = createMessageHandler(callback);
		browser.runtime.onMessage.addListener(handler);

		return () => {
			browser.runtime.onMessage.removeListener(handler);
		};
	}, []);
};
