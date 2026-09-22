import {test as baseTest, expect} from '@playwright/test';
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

	await page.sendMessage(
		'runtime',
		applyHelpers([{helper: 'disableAllStyles'}])
	);
	await expect(page.elementHiddenViaStyleSheet).toBeVisible();
	await expect(page.elementHiddenViaStyleTag).toBeVisible();
	await expect(page.elementHiddenViaStyleAttribute).toBeVisible();

	await page.sendMessage('runtime', revertActiveHelpers());
	await expect(page.elementHiddenViaStyleSheet).toBeHidden();
	await expect(page.elementHiddenViaStyleTag).toBeHidden();
	await expect(page.elementHiddenViaStyleAttribute).toBeHidden();
});

test('should outline elements', async ({helpersPage: page}) => {
	await expect(page.visibleElement).toBeVisible();
	await expect(page.visibleElement).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);

	await page.sendMessage(
		'runtime',
		applyHelpers([{helper: 'outline', selector: 'p'}])
	);

	await expect(page.visibleElement).toContainClass(
		'rgaaExt-Highlight--outline'
	);

	await page.sendMessage('runtime', revertActiveHelpers());

	await expect(page.visibleElement).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);
});

test('should not outline hidden elements', async ({helpersPage: page}) => {
	await page.sendMessage(
		'runtime',
		applyHelpers([{helper: 'outline', selector: 'p', showIfHidden: false}])
	);

	await expect(page.elementHiddenViaStyleSheet).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);

	await page.sendMessage('runtime', revertActiveHelpers());

	await expect(page.elementHiddenViaStyleSheet).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);

	// If any helper requests highlights on hidden elements,
	// it takes precedence over the others.
	await page.sendMessage(
		'runtime',
		applyHelpers([
			{helper: 'outline', selector: 'p', showIfHidden: false},
			{helper: 'outline', selector: 'p', showIfHidden: true},
			{helper: 'outline', selector: 'p', showIfHidden: false}
		])
	);

	await expect(page.elementHiddenViaStyleSheet).toContainClass(
		'rgaaExt-Highlight--outline'
	);

	await page.sendMessage('runtime', revertActiveHelpers());

	await expect(page.elementHiddenViaStyleSheet).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);

	// When styles are disabled, elements should always be
	// outlined, as no style can effectively hide them.
	await page.sendMessage(
		'runtime',
		applyHelpers([
			{helper: 'disableAllStyles'},
			{helper: 'outline', selector: 'p'},
			{helper: 'outline', selector: 'p', showIfHidden: false}
		])
	);

	await expect(page.elementHiddenViaStyleSheet).toContainClass(
		'rgaaExt-Highlight--outline'
	);

	await page.sendMessage('runtime', revertActiveHelpers());

	await expect(page.elementHiddenViaStyleSheet).not.toContainClass(
		'rgaaExt-Highlight--outline'
	);
});

test('should extract headings hierarchy', async ({helpersPage: page}) => {
	await page.sendMessage(
		'runtime',
		applyHelpers([{helper: 'headingsHierarchy'}])
	);

	await page.expectNextSentMessage('runtime', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.sendMessage('runtime', revertActiveHelpers());
	await page.sendMessage(
		'runtime',
		applyHelpers([{helper: 'headingsHierarchy'}])
	);

	await page.expectNextSentMessage('runtime', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 2, text: 'Heading 2'},
			{level: 3, text: 'Heading 3'}
		]
	});

	await page.removeIntermediateHeading();

	await page.expectNextSentMessage('runtime', {
		type: 'helpers/headingsHierarchy/set',
		payload: [
			{level: 1, text: 'Heading 1'},
			{level: 3, text: 'Heading 3'}
		]
	});
});
