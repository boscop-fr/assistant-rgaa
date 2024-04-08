import {PANEL_PAGE} from './tabs';

const isChromeApi = () =>
	typeof chrome !== 'undefined' && 'sidePanel' in chrome;

const openBrowserSidebar = (tabId: number) => {
	browser.sidebarAction.setPanel({
		tabId,
		panel: browser.runtime.getURL(PANEL_PAGE)
	});

	browser.sidebarAction.open();
};

const openChromeSidebar = (tabId: number) => {
	chrome.sidePanel.setOptions({
		tabId,
		path: PANEL_PAGE,
		enabled: true
	});

	chrome.sidePanel.open({
		tabId
	});
};

export const openSidebar = (tabId: number) => {
	if (isChromeApi()) {
		openChromeSidebar(tabId);
	} else {
		openBrowserSidebar(tabId);
	}
};

const closeBrowserSidebar = (tabId: number) => {
	browser.sidebarAction.setPanel({
		tabId,
		panel: null
	});
};

const closeChromeSidebar = (tabId: number) => {
	chrome.sidePanel.setOptions({
		tabId,
		path: PANEL_PAGE,
		enabled: false
	});
};

export const closeSidebar = (tabId: number) => {
	if (isChromeApi()) {
		closeChromeSidebar(tabId);
	} else {
		closeBrowserSidebar(tabId);
	}
};
