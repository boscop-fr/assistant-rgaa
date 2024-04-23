import {sendMessage} from '../common/utils/runtime';
import {clearTabState, fetchCurrentTab} from '../common/utils/tabs';
import {
	captureCurrentTab,
	closePopup,
	createTab,
	isProxiedAction,
	openPopup,
	openSidebar as openSidebarAction,
	tabLoaded,
	tabUnloaded,
	validatePage,
	viewPageSource
} from './slices/runtime';
import {injectContentScripts} from './utils/content';
import {closeSidebar, openSidebar} from './utils/sidebar';
import {PANEL_PAGE, captureVisibleTab} from './utils/tabs';
import {validateLocalPage} from './utils/validateLocalPage';
import {viewSource} from './utils/viewSource';

// We're avoiding promises (and thus async/await) here,
// because of a sneaky chrome bug.
// The call to sidePanel.open() must be done under 1ms after
// a click on the action to be considered initiated by the
// user.
// @see https://issues.chromium.org/issues/40929586
browser.action.onClicked.addListener((tab) => {
	openSidebar(tab.id);
});

browser.runtime.onConnect.addListener(async (port) => {
	const tabId = parseInt(port.name, 10);

	// We're using the disconnection callback to detect when
	// the sidebar is closed.
	// @see https://stackoverflow.com/a/77106777/2391359
	port.onDisconnect.addListener(async () => {
		await browser.tabs.sendMessage(tabId, tabUnloaded());
	});
});

browser.tabs.onRemoved.addListener(async (tabId) => {
	await clearTabState(tabId);
});

browser.runtime.onMessage.addListener(async (message) => {
	if (openSidebarAction.match(message)) {
		return openSidebar(message.payload.tabId);
	}

	if (openPopup.match(message)) {
		const {tabId} = message.payload;
		await browser.windows.create({
			url: `${browser.runtime.getURL(PANEL_PAGE)}?tabId=${tabId}`,
			type: 'popup'
		});

		return closeSidebar(tabId);
	}

	if (closePopup.match(message)) {
		const {tabId, popupTabId} = message.payload;
		await browser.tabs.remove(popupTabId);
		return openSidebar(tabId);
	}

	if (tabLoaded.match(message)) {
		await injectContentScripts(message.payload.tabId);
	}

	if (captureCurrentTab.match(message)) {
		return captureVisibleTab();
	}

	if (validatePage.match(message)) {
		return validateLocalPage(message.payload.url);
	}

	if (viewPageSource.match(message)) {
		return viewSource(message.payload.url);
	}

	if (createTab.match(message)) {
		const {index} = await fetchCurrentTab();
		return browser.tabs.create({
			url: message.payload.url,
			index: index + 1
		});
	}

	if (isProxiedAction(message)) {
		return sendMessage(message);
	}
});
