import {ActionCreatorWithOptionalPayload} from '@reduxjs/toolkit';

export const onRuntimeAction = <T>(
	actionCreator: ActionCreatorWithOptionalPayload<T>,
	callback: (action: ReturnType<ActionCreatorWithOptionalPayload<T>>) => void
) => {
	const handler = (message: any) => {
		if (actionCreator.match(message)) {
			callback(message);
		}
	};

	browser.runtime.onMessage.addListener(handler);

	return () => {
		browser.runtime.onMessage.removeListener(handler);
	};
};
