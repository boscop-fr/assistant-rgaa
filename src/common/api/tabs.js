import {INVALID_RESPONSE} from '../slices/runtime';
import {clearData, getData, setData} from './storage';

/**
 *
 */
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

/**
 *
 */
export const sendMessage = async (tabId, message, options) => {
	const response = browser.tabs.sendMessage(tabId, message, options);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

/**
 *
 */
const onUpdate = (callback) => {
	browser.tabs.onUpdated.addListener(callback);

	return () => {
		browser.tabs.onUpdated.removeListener(callback);
	};
};

/**
 *
 */
export const onTabLoaded = (id, callback) => {
	const cleanup = onUpdate((tabId, {status}) => {
		if (tabId === id && status === 'complete') {
			callback();
			cleanup();
		}
	});
};


export const getTabState = (tabId) => getData(`${tabId}.state`, undefined);
export const setTabState = (tabId, state) => setData(`${tabId}.state`, state);
export const clearTabState = (tabId) => clearData(`${tabId}.state`);
