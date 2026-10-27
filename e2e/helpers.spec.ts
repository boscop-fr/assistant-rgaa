import {test as baseTest, expect} from '@playwright/test';
import {getHierarchy} from '../src/helpers/slices/headingsHierarchy';
import {applyHelpers, revertActiveHelpers} from '../src/panel/slices/helpers';
import HelpersPage from './HelpersPage';

const test = baseTest.extend<{helpersPage: HelpersPage}>({
	helpersPage: async ({page}, use) => {
		const helpersPage = new HelpersPage(page);
		await helpersPage.setup();
		await use(helpersPage);
	}
});

test('should toggle styles', async ({helpersPage: page}) => {
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
	await expect(page.elementHiddenViaStyleTag).toBeHidden();
	await expect(page.elementHiddenViaStyleAttribute).toBeHidden();

	await page.postToPort(applyHelpers([{helper: 'disableAllStyles'}]));
	await expect(page.elementHiddenViaStyleSheet).toBeVisible();
	await expect(page.elementHiddenViaStyleTag).toBeVisible();
	await expect(page.elementHiddenViaStyleAttribute).toBeVisible();

	await page.postToPort(revertActiveHelpers());
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
	await expect(page.elementHiddenViaStyleTag).toBeHidden();
	await expect(page.elementHiddenViaStyleAttribute).toBeHidden();
});

test('should revert helpers when the panel disconnects', async ({
	helpersPage: page
}) => {
	await page.postToPort(applyHelpers([{helper: 'disableAllStyles'}]));
	await expect(page.elementHiddenViaStyleSheet).toBeVisible();

	await page.disconnectPort();
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
});

test('should apply helpers along with helpers without effects', async ({
	helpersPage: page
}) => {
	await page.postToPort(
		applyHelpers([{helper: 'viewSource'}, {helper: 'disableAllStyles'}])
	);
	await expect(page.elementHiddenViaStyleSheet).toBeVisible();

	await page.postToPort(revertActiveHelpers());
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
});

test('should answer requests from the helper handling them', async ({
	helpersPage: page
}) => {
	// The color contrast helper listens to messages too, and
	// must not answer the ones it doesn't handle.
	await page.postToPort(
		applyHelpers([{helper: 'colorContrast'}, {helper: 'headingsHierarchy'}])
	);

	expect(await page.sendMessage('runtime', getHierarchy())).toStrictEqual([
		{level: 1, text: 'Heading 1'},
		{level: 2, text: 'Heading 2'},
		{level: 3, text: 'Heading 3'}
	]);
});

test('should extract headings hierarchy', async ({helpersPage: page}) => {
	await page.postToPort(applyHelpers([{helper: 'headingsHierarchy'}]));

	await page.expectNextSentMessage('port', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.postToPort(revertActiveHelpers());
	await page.postToPort(applyHelpers([{helper: 'headingsHierarchy'}]));

	await page.expectNextSentMessage('port', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.removeIntermediateHeading();

	await page.expectNextSentMessage('port', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.addNestedHeading();

	await page.expectNextSentMessage('port', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 3, text: 'Heading 3'},
			{level: 4, text: 'Heading 4'}
		]
	});
});
