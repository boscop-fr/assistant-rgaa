import {getSource} from './source';
import {fetchCurrentTab, onTabLoaded, sendMessage} from './tabs';

/**
 *
 */
export const viewSource = async (url) => {
	const source = await getSource(url);
	const currentTab = await fetchCurrentTab();
	const tab = await browser.tabs.create({
		url: browser.runtime.getURL('pages/viewSource.html'),
		index: currentTab.index + 1
	});

	onTabLoaded(tab.id, () => {
		sendMessage(tab.id, source);
	});
};
