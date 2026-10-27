import {fetchCurrentTab} from '../common/utils/tabs';
import {answerMessages, browser} from '../common/utils/webExtension';
import {
	appLoaded,
	captureCurrentTab,
	closePopup,
	createTab,
	openPopup,
	openSidebar as openSidebarAction,
	validatePage,
	viewPageSource
} from './slices/runtime';
import {injectContentScripts} from './utils/content';
import {closeSidebar, openSidebar, reloadSidebar} from './utils/sidebar';
import {openWithSource} from './utils/source';
import {captureVisibleTab, PANEL_PAGE} from './utils/tabs';

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
	answerMessages((message) => {
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

			// Answers once scripts are injected, so the panel
			// can connect to them, telling if they could be.
			// Content scripts can't be injected in some pages
			// (i.e. browser pages).
			case appLoaded.match(message):
				return injectContentScripts(message.payload.tabId).then(
					() => true,
					(e) => {
						console.warn(e);
						return false;
					}
				);

			case captureCurrentTab.match(message):
				return captureVisibleTab();

			case validatePage.match(message):
				openWithSource('pages/validateLocalPage.html', message.payload.url);
				break;

			case viewPageSource.match(message):
				openWithSource('pages/viewSource.html', message.payload.url);
				break;

			case createTab.match(message):
				fetchCurrentTab().then(({index}) => {
					browser.tabs.create({
						url: message.payload.url,
						index: index + 1
					});
				});

				break;
		}
	})
);
