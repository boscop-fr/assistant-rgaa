export const fetchCurrentTab = async () => {
	const query = {
		active: true,
		currentWindow: true
	};

	const tabs = await browser.tabs.query(query);

	if (!tabs.length) {
		throw new Error('No tab found');
	}

	return tabs[0];
};

const onTabUpdated = (
	callback: Parameters<typeof browser.tabs.onUpdated.addListener>[0]
) => {
	browser.tabs.onUpdated.addListener(callback);

	return () => {
		browser.tabs.onUpdated.removeListener(callback);
	};
};

export const onTabLoaded = (id: number, callback: () => void) => {
	const cleanup = onTabUpdated((tabId, {status}) => {
		if (tabId === id && status === 'complete') {
			callback();
			cleanup();
		}
	});
};

export const onTabMount = (id: number, callback: () => () => void) => {
	let isLoading = false;
	let cleanup = callback();

	return onTabUpdated((tabId, {status}) => {
		if (tabId !== id) {
			return;
		}

		if (status === 'loading') {
			isLoading = true;
			cleanup();
			return;
		}

		if (status === 'complete' && isLoading) {
			isLoading = false;
			cleanup = callback();
		}
	});
};
