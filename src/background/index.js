import {
	CLOSE_POPUP,
	CREATE_TAB,
	GET_CURRENT_TAB,
	GET_PIXEL,
	INVALID_RESPONSE,
	OPEN_POPUP,
	OPEN_SIDEBAR,
	VALIDATE_PAGE,
	VIEW_PAGE_SOURCE
} from '../common/actions/runtime';
import {getPixelAt} from '../common/api/image';
import {createMessageHandler} from '../common/api/runtime';
import {clearTabState, fetchCurrentTab} from '../common/api/tabs';
import {validateLocalPage} from '../common/api/validateLocalPage';
import {viewSource} from '../common/api/viewSource';
import {injectHelpersScripts, removeHelpersScripts} from '../helpers/api/tabs';
import {openSidebar, closeSidebar} from './api/sidebar';
import {PanelPage, captureVisibleTab} from './api/tabs';

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
	await injectHelpersScripts(tabId);

	// We're using the disconnection callback to detect when
	// the sidebar is closed.
	// @see https://stackoverflow.com/a/77106777/2391359
	port.onDisconnect.addListener(async () => {
		await removeHelpersScripts(tabId);
	});
});

browser.tabs.onRemoved.addListener(async (tabId) => {
	await clearTabState(tabId);
});

browser.runtime.onMessage.addListener(
	createMessageHandler(async (message) => {
		switch (message.type) {
			case OPEN_SIDEBAR: {
				openSidebar(message.tabId);
				return true;
			}

			case OPEN_POPUP: {
				await browser.windows.create({
					url: `${browser.runtime.getURL(PanelPage)}?tabId=${
						message.tabId
					}`,
					type: 'popup'
				});

				await closeSidebar(message.tabId);
				return true;
			}

			// if the instance runs in a popup, desindexes it and
			// closes it.
			case CLOSE_POPUP:
				await browser.tabs.remove(message.popupTabId);
				await openSidebar(message.tabId);
				return true;

			// sends the store's state to the instance.
			case GET_PIXEL:
				return captureVisibleTab().then((image) =>
					getPixelAt(image, message.x, message.y)
				);

			// sends current tab's info to the instance.
			case GET_CURRENT_TAB:
				return fetchCurrentTab();

			case VALIDATE_PAGE:
				return validateLocalPage(message.url);

			case VIEW_PAGE_SOURCE:
				return viewSource(message.url);

			// create a tab with the given url, next to the current tab
			case CREATE_TAB:
				return fetchCurrentTab().then((currentTab) =>
					browser.tabs.create({
						url: message.url,
						index: currentTab.index + 1
					})
				);

			default:
				return INVALID_RESPONSE;
		}
	})
);
