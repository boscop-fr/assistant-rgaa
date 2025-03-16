import {isAction} from 'redux';
import browser from 'webextension-polyfill';
import type {Runtime} from 'webextension-polyfill';
import {fetchCurrentTab} from '../common/utils/tabs';
import {
	appLoaded,
	captureCurrentTab,
	closePopup,
	createTab,
	openPopup,
	openSidebar as openSidebarAction,
	tabAction,
	validatePage,
	viewPageSource
} from './slices/runtime';
import {injectContentScripts} from './utils/content';
import {closeSidebar, openSidebar, reloadSidebar} from './utils/sidebar';
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

browser.tabs.onActivated.addListener((tab) => {
	reloadSidebar(tab.tabId);
});

browser.runtime.onMessage.addListener(
	(message: unknown, sender: Runtime.MessageSender) => {
		switch (true) {
			case openSidebarAction.match(message):
				openSidebar(message.payload.tabId);
				break;

			case openPopup.match(message):
				closeSidebar(message.payload.tabId);
				browser.windows.create({
					url: `${browser.runtime.getURL(PANEL_PAGE)}?tabId=${message.payload.tabId}`,
					type: 'popup'
				});
				break;

			case closePopup.match(message):
				browser.tabs.remove(message.payload.popupTabId);
				openSidebar(message.payload.tabId);
				break;

			case appLoaded.match(message):
				injectContentScripts(message.payload.tabId);
				break;

			case captureCurrentTab.match(message):
				return captureVisibleTab();

			case validatePage.match(message):
				validateLocalPage(message.payload.url);
				break;

			case viewPageSource.match(message):
				viewSource(message.payload.url);
				break;

			case createTab.match(message):
				fetchCurrentTab().then(({index}) => {
					browser.tabs.create({
						url: message.payload.url,
						index: index + 1
					});
				});

				break;

			case isAction(message) && !!sender?.tab?.id:
				browser.runtime.sendMessage(
					tabAction({
						tabId: sender.tab.id,
						action: message
					})
				);
				break;
		}
	}
);
