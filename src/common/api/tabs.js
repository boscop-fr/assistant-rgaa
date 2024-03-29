import {INVALID_RESPONSE} from '../actions/runtime';
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
export const sendMessage = async (message, tabId, data) => {
	const response = browser.tabs.sendMessage(message, tabId, data);

	if (response === INVALID_RESPONSE) {
		throw new Error(response);
	}

	return response;
};

export const getTabState = (tabId) => getData(`${tabId}.state`, {});
export const setTabState = (tabId, state) => setData(`${tabId}.state`, state);
export const clearTabState = (tabId) => clearData(`${tabId}.state`);
