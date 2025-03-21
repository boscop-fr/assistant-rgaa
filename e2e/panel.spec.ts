import {test as baseTest, expect} from '@playwright/test';
import disableAllStyles from '../src/helpers/helpers/disableAllStyles';
import {applyHelpers, revertActiveHelpers} from '../src/panel/slices/helpers';
import PanelPage from './PanelPage';

const test = baseTest.extend<{panelPage: PanelPage}>({
	panelPage: async ({page}, use) => {
		const panelPage = new PanelPage(page);
		await panelPage.setup();
		await use(panelPage);
	}
});

test('should toggle styles', async ({panelPage: page}) => {
	await page.toggleCssButton.click();
	await page.expectNextSentMessage(
		'tabs',
		'current',
		applyHelpers([
			{
				helper: disableAllStyles.name
			}
		])
	);

	await page.toggleCssButton.click();
	await page.expectNextSentMessage('tabs', 'current', revertActiveHelpers());
});
