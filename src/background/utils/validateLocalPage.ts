import {fetchCurrentTab, onTabLoaded} from '../../common/utils/tabs';
import {getSource} from './source';

export const validateLocalPage = async (url: string) => {
	const source = await getSource(url);
	const currentTab = await fetchCurrentTab();
	const tab = await browser.tabs.create({
		url: browser.runtime.getURL('pages/validateLocalPage.html'),
		index: currentTab.index + 1
	});

	onTabLoaded(tab.id, () => {
		browser.tabs.sendMessage(tab.id, source);
	});
};
