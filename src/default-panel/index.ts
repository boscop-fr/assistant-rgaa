import {openSidebar} from '../background/slices/runtime';
import {fetchCurrentTab} from '../common/utils/tabs';
import {browser} from '../common/utils/webExtension';

document.getElementById('launch').addEventListener('click', async () => {
	const currentTab = await fetchCurrentTab();

	await browser.runtime.sendMessage(
		openSidebar({
			tabId: currentTab.id
		})
	);
});
