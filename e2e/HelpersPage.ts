import {type Page} from '@playwright/test';

export default class HelpersPage {
	readonly #page: Page;
	#sendMessage: (action: any) => void;

	constructor(page: Page) {
		this.#page = page;
	}

	async setup() {
		await this.#page.addInitScript(() => {
			// This tricks the webext polyfill into considering the
			// page as having an extension context.
			globalThis.chrome = {
				runtime: {
					id: 'playwright'
				}
			};

			// Stubs the webext API.
			globalThis.browser = {
				runtime: {
					id: 'playwright',
					sendMessage() {},
					onMessage: {
						addListener(callback) {
							globalThis.sendMessage = callback;
						}
					}
				}
			};
		});

		await this.#page.route('/', async (route) => {
			await route.fulfill({
				path: 'e2e/helpers.html'
			});
		});

		await this.#page.goto('/');

		await this.#page.addScriptTag({
			path: 'dist/helpers.js'
		});

		await this.#page.addStyleTag({
			path: 'dist/helpers.css'
		});

		await this.#page.addStyleTag({
			path: 'e2e/helpers.css'
		});
	}

	async sendMessage(action: any) {
		return this.#page.evaluate(async (a) => {
			globalThis.sendMessage(a);
		}, action);
	}

	get elementHiddenViaStyleSheet() {
		return this.#page.locator('#hidden-sheet');
	}

	get elementHiddenViaStyleTag() {
		return this.#page.locator('#hidden-tag');
	}

	get elementHiddenViaStyleAttribute() {
		return this.#page.locator('#hidden-attribute');
	}
}
