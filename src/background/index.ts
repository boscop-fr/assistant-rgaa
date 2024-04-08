import {createMessageHandler, sendMessage} from '../common/utils/runtime';
import {clearTabState, fetchCurrentTab} from '../common/utils/tabs';
import {
	INVALID_RESPONSE,
	closePopup,
	createTab,
	getPixel,
	helpersReady,
	openPopup,
	openSidebar as openSidebarAction,
	tabReloaded,
	tabUnloaded,
	validatePage,
	viewPageSource
} from './slices/runtime';
import {injectContentScripts, removeContentScripts} from './utils/content';
import {getPixelAt} from './utils/image';
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
	await injectContentScripts(tabId);

	port.onMessage.addListener(async (message) => {
		if (tabReloaded.match(message)) {
			await injectContentScripts(tabId);
		}
	});

	// We're using the disconnection callback to detect when
	// the sidebar is closed.
	// @see https://stackoverflow.com/a/77106777/2391359
	port.onDisconnect.addListener(async () => {
		await browser.tabs.sendMessage(tabId, tabUnloaded());
		await removeContentScripts(tabId);
	});
});

browser.tabs.onRemoved.addListener(async (tabId) => {
	await clearTabState(tabId);
});

browser.runtime.onMessage.addListener(
	createMessageHandler(async (message) => {
		if (openSidebarAction.match(message)) {
			openSidebar(message.payload.tabId);
			return true;
		}

		if (openPopup.match(message)) {
			const {tabId} = message.payload;
			await browser.windows.create({
				url: `${browser.runtime.getURL(PANEL_PAGE)}?tabId=${tabId}`,
				type: 'popup'
			});

			await closeSidebar(tabId);
			return true;
		}

		if (closePopup.match(message)) {
			const {tabId, popupTabId} = message.payload;
			await browser.tabs.remove(popupTabId);
			await openSidebar(tabId);
			return true;
		}

		if (getPixel.match(message)) {
			const {x, y} = message.payload;
			const capture = await captureVisibleTab();
			return getPixelAt(capture, x, y);
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

		// Proxies the action from content scripts to the
		// sidebar, as they can't communicate directly.
		if (helpersReady.match(message)) {
			sendMessage(message);
			return true;
		}

		return INVALID_RESPONSE;
	})
);
