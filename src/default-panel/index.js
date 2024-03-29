import {OPEN_SIDEBAR} from '../common/actions/runtime';
import {sendMessage} from '../common/api/runtime';
import {fetchCurrentTab} from '../common/api/tabs';

document.getElementById('launch').addEventListener('click', async () => {
	const currentTab = await fetchCurrentTab();

	await sendMessage({
		type: OPEN_SIDEBAR,
		tabId: currentTab.id
	});
});
