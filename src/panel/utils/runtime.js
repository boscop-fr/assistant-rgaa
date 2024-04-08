export const onRuntimeAction = (action, callback) => {
	const handler = (message) => {
		if (action.match(message)) {
			callback(message);
		}
	};

	browser.runtime.onMessage.addListener(handler);

	return () => {
		browser.runtime.onMessage.removeListener(handler);
	};
};
