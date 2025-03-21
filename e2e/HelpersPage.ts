import ExtensionPage from './ExtensionPage';

export default class HelpersPage extends ExtensionPage {
	async setup() {
		await super.setup('e2e/helpers.html');

		await this.page.addScriptTag({
			url: '/dist/helpers.js'
		});

		await this.page.addStyleTag({
			url: '/dist/helpers.css'
		});

		await this.page.addStyleTag({
			path: 'e2e/helpers.css'
		});
	}

	get elementHiddenViaStyleSheet() {
		return this.page.locator('#hidden-sheet');
	}

	get elementHiddenViaStyleTag() {
		return this.page.locator('#hidden-tag');
	}

	get elementHiddenViaStyleAttribute() {
		return this.page.locator('#hidden-attribute');
	}

	async removeIntermediateHeading() {
		await this.page.evaluate(() => {
			document.querySelector('h2')?.remove();
		});
	}
}
