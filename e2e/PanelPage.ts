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
}
