import browser from 'webextension-polyfill';
import {PANEL_PAGE} from './tabs';

const isChromeApi = () =>
	typeof chrome !== 'undefined' && 'sidePanel' in chrome;

const openBrowserSidebar = (tabId: number) => {
	browser.sidebarAction.setPanel({
		tabId,
		panel: browser.runtime.getURL(PANEL_PAGE)
	});

	browser.sidebarAction.open().catch((e) => {
		console.warn(e.message);
	});
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

const closeBrowserSidebar = (tabId: number) =>
	browser.sidebarAction.setPanel({
		tabId,
		panel: null
	});

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

// This is meant to be called whenever the active tab
// changes to emulate chrome's behavior on firefox.
// If a sidebar was already loaded for the given tab, it is
// closed and reopened so it syncs with the tab.
// Without this hack, the last open instance stays open even
// when changing tab.
export const reloadSidebar = async (tabId: number) => {
	if (isChromeApi()) {
		return;
	}

	const panel = await browser.sidebarAction.getPanel({tabId});

	if (panel === browser.runtime.getURL(PANEL_PAGE)) {
		await closeBrowserSidebar(tabId);
		openBrowserSidebar(tabId);
	}
};
