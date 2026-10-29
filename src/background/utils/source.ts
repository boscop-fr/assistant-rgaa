import {fetchCurrentTab, getTabId, onTabLoaded} from '../../common/utils/tabs';
import {browser} from '../../common/utils/webExtension';

// Gets the source code of the page at the given URL.
const getSource = (url: string) => fetch(url).then((content) => content.text());

// Opens the given extension page next to the current tab,
// and sends it the source code of the page at the given URL.
export const openWithSource = async (page: string, url: string) => {
	const source = await getSource(url);
	const currentTab = await fetchCurrentTab();
	const tab = await browser.tabs.create({
		url: browser.runtime.getURL(page),
		index: currentTab.index + 1
	});
	const tabId = getTabId(tab);

	onTabLoaded(tabId, () => {
		browser.tabs.sendMessage(tabId, source);
	});
};
