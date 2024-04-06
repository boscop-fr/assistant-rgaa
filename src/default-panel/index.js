import {openSidebar} from '../background/slices/runtime';
import {sendMessage} from '../common/utils/runtime';
import {fetchCurrentTab} from '../common/utils/tabs';

document.getElementById('launch').addEventListener('click', async () => {
	const currentTab = await fetchCurrentTab();

	await sendMessage(
		openSidebar({
			tabId: currentTab.id
		})
	);
});
