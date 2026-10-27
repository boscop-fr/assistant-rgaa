import ExtensionPage from './ExtensionPage';

export default class PanelPage extends ExtensionPage {
	async setup() {
		await super.setup('e2e/panel.html');

		await this.page.addScriptTag({
			url: '/dist/panel.js'
		});

		await this.page.addStyleTag({
			url: '/dist/panel.css'
		});
	}

	get toggleCssButton() {
		return this.page.getByRole('button', {name: 'CSS'});
	}

	async enableTest(id: string) {
		const criterionId = id.split('.').slice(0, 2).join('.');
		await this.page
			.getByRole('button', {
				name: `Afficher les tests du critère ${criterionId}`
			})
			.click();

		await this.page.locator(`[id="test-${id}-apply-input"]`).check();
	}

	async setTestStatus(id: string, status: string) {
		await this.page.locator(`label[for="TestStatus--${id}-${status}"]`).click();
	}

	testStatus(id: string, status: string) {
		return this.page.locator(`[id="TestStatus--${id}-${status}"]`);
	}
}
