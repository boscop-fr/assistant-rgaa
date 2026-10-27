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

		// Connects as a panel would once scripts are injected.
		await this.connect();
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

	async addNestedHeading() {
		await this.page.evaluate(() => {
			const heading = document.createElement('h4');
			heading.textContent = 'Heading 4';
			document.querySelector('#nested-headings')?.appendChild(heading);
		});
	}
}
