import {getSource} from './source';
import {onUpdate} from '../../background/api/tabs';
import {getWindowObject} from '../../background/api/windows';
import {fetchCurrentTab} from './tabs';

/**
 *
 */
export const validateLocalPage = (url) => {
	let source;
	return getSource(url)
		.then((sourceString) => {
			source = sourceString;
		})
		.then(() => fetchCurrentTab())
		.then((currentTab) =>
			browser.tabs.create({
				url: browser.runtime.getURL('pages/validateLocalPage.html'),
				index: currentTab.index + 1
			})
		)
		.then((tab) => {
			// @see http://stackoverflow.com/q/18045348
			// I'm sure there is some better way to do this but well…
			// couldn't figure it out with the time I have right now
			onUpdate((tabId, {status}) => {
				if (status !== 'complete' || tabId !== tab.id) {
					return;
				}
				const tabUrl = tab?.pendingUrl || tab?.url;
				const tabWindow = getWindowObject(tabUrl, {
					type: 'tab',
					windowId: tab.windowId
				});
				if (!tabWindow || typeof tabWindow?.validateSource !== 'function') {
					return;
				}
				tabWindow.validateSource(source);
			});
		});
};
