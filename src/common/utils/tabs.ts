import type {AppState} from '../../panel/store';
import {clearData, getData, setData} from './storage';

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

export const sendMessage = browser.tabs.sendMessage;

const onUpdate = (
	callback: Parameters<typeof browser.tabs.onUpdated.addListener>[0]
) => {
	browser.tabs.onUpdated.addListener(callback);

	return () => {
		browser.tabs.onUpdated.removeListener(callback);
	};
};

export const onTabLoaded = (id: number, callback: () => void) => {
	const cleanup = onUpdate((tabId, {status}) => {
		if (tabId === id && status === 'complete') {
			callback();
			cleanup();
		}
	});
};

export const onTabReloaded = (
	id: number,
	callback: () => void,
	initial = true
) => {
	let isLoading = false;

	if (initial) {
		callback();
	}

	return onUpdate((tabId, {status}) => {
		if (tabId !== id) {
			return;
		}

		if (status === 'loading') {
			isLoading = true;
		} else if (status === 'complete' && isLoading) {
			isLoading = false;
			callback();
		}
	});
};

export const getTabState = (tabId: number) =>
	getData(`${tabId}.state`, undefined);

export const setTabState = (tabId: number, state: AppState) =>
	setData(`${tabId}.state`, state);

export const clearTabState = (tabId: number) => clearData(`${tabId}.state`);
