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

test('should extract headings hierarchy', async ({helpersPage: page}) => {
	await page.sendMessage(applyHelpers([{helper: 'headingsHierarchy'}]));

	await expect(await page.lastSentMessage()).toEqual({
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.sendMessage(revertActiveHelpers());
	await page.sendMessage(applyHelpers([{helper: 'headingsHierarchy'}]));

	await expect(await page.lastSentMessage()).toEqual({
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.removeIntermediateHeading();
	await page.waitForNextSentMessage();

	await expect(await page.lastSentMessage()).toEqual({
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 3, text: 'Heading 3'}
		]
	});
});
