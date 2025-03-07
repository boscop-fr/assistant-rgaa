import {test as baseTest, expect} from '@playwright/test';
import {applyHelpers, revertActiveHelpers} from '../src/panel/slices/helpers';
import HelpersPage from './HelpersPage';

const test = baseTest.extend<{helpersPage: HelpersPage}>({
	helpersPage: async ({page}, use) => {
		const todoPage = new HelpersPage(page);
		await todoPage.setup();
		await use(todoPage);
	}
});

test('should toggle styles', async ({helpersPage: page}) => {
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
	await expect(page.elementHiddenViaStyleTag).toBeHidden();
	await expect(page.elementHiddenViaStyleAttribute).toBeHidden();

	await page.sendMessage(applyHelpers([{helper: 'disableAllStyles'}]));
	await expect(page.elementHiddenViaStyleSheet).toBeVisible();
	await expect(page.elementHiddenViaStyleTag).toBeVisible();
	await expect(page.elementHiddenViaStyleAttribute).toBeVisible();

	await page.sendMessage(revertActiveHelpers());
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
	await expect(page.elementHiddenViaStyleTag).toBeHidden();
	await expect(page.elementHiddenViaStyleAttribute).toBeHidden();
});
