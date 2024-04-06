import {eventChannel} from 'redux-saga';

export const messageChannel = (action) =>
	eventChannel((emit) => {
		const handleMessage = (message) => {
			if (action.match(message)) {
				emit(message);
			}
		};

		browser.runtime.onMessage.addListener(handleMessage);

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage);
		};
	});
