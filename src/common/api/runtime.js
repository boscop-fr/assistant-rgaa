import {isEmpty} from 'lodash';
import {INVALID_RESPONSE} from '../actions/runtime';

/**
 *
 */
export const sendMessage = async (message, options = {}) => {
	const response = await browser.runtime.sendMessage(message, options);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

/**
 *
 */
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
