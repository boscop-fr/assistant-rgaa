import type {Browser, Runtime} from 'webextension-polyfill';

const globals = globalThis as {browser?: Browser; chrome?: unknown};

// Firefox exposes the WebExtension API as `browser`, Chrome as
// `chrome`. Both return promises in manifest v3.
export const browser = globals.browser ?? (globals.chrome as Browser);

// Turns a function answering some messages into a message
// listener. It returns a promise for messages it answers, and
// nothing for others, so other listeners can answer them.
// Answers go through `sendResponse`, as Chrome doesn't support
// listeners returning promises in all supported versions.
export const answerMessages = (
	answer: (message: unknown) => Promise<unknown> | undefined
) =>
	// The types only allow returning `true` along with
	// `sendResponse`, while browsers also accept `false`.
	((
		message: unknown,
		_sender: unknown,
		sendResponse: (response?: unknown) => void
	) => {
		const response = answer(message);

		if (!response) {
			return false;
		}

		response.then(sendResponse, (e) => {
			console.error(e);
			sendResponse();
		});

		return true;
	}) as Runtime.OnMessageListener;
