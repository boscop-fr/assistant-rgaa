import {sendMessage} from '../common/api/runtime';
import {fetchCurrentTab} from '../common/api/tabs';
import {openSidebar} from '../common/slices/runtime';

document.getElementById('launch').addEventListener('click', async () => {
	const currentTab = await fetchCurrentTab();

	await sendMessage(
		openSidebar({
			tabId: currentTab.id
		})
	);
});
