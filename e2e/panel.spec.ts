import {test as baseTest, expect} from '@playwright/test';
import {applyHelpers, revertActiveHelpers} from '../src/helpers/slices/helpers';
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
		'port',
		applyHelpers([
			{
				helper: 'disableAllStyles'
			}
		])
	);

	await page.toggleCssButton.click();
	await page.expectNextSentMessage('port', revertActiveHelpers());
});

test('should keep results when switching reference version', async ({
	panelPage: page
}) => {
	await page.enableTest('1.1.1');
	await page.setTestStatus('1.1.1', 'C');
	await expect(page.testStatus('1.1.1', 'C')).toBeChecked();

	await page.changeOption('referenceVersion', '4-2023', '4-2021');
	await expect(page.testStatus('1.1.1', 'C')).toHaveCount(0);

	await page.changeOption('referenceVersion', '4-2021', '4-2023');
	await expect(page.testStatus('1.1.1', 'C')).toBeChecked();
});
