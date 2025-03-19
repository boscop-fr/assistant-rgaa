import {openSidebar} from '../background/slices/runtime';
import {fetchCurrentTab} from '../common/utils/tabs';

document.getElementById('launch').addEventListener('click', async () => {
	const currentTab = await fetchCurrentTab();

	// This doesn't need polyfilling as it is used solely in
	// Firefox (a default panel isn't needed in oter browsers).
	await browser.runtime.sendMessage(
		openSidebar({
			tabId: currentTab.id
		})
	);
});
