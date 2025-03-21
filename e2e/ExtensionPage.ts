import {type Page, expect} from '@playwright/test';
import type {Action} from 'redux';

type ExtensionApi = 'runtime' | 'tabs';

export default class ExtensionPage {
	protected readonly page: Page;

	constructor(page: Page) {
		this.page = page;
		this.page.on('console', console.log.bind(console));
	}

	async setup(path: string) {
		await this.page.addInitScript(() => {
			globalThis.messageListeners = {};
			globalThis.sentMessages = {};

			const pushListener = (api, listener) => {
				if (!(api in globalThis.messageListeners)) {
					globalThis.messageListeners[api] = new Set();
				}

				globalThis.messageListeners[api].add(listener);
			};

			const removeListener = (api, listener) => {
				globalThis.messageListeners[api].delete(listener);
			};

			const pushMessage = (api, args) => {
				if (!(api in globalThis.sentMessages)) {
					globalThis.sentMessages[api] = [];
				}

				globalThis.sentMessages[api].push(args);
			};

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
					sendMessage(...args) {
						pushMessage('runtime', args);
					},
					onMessage: {
						addListener(listener) {
							pushListener('runtime', listener);
						},
						removeListener(listener) {
							removeListener('runtime', listener);
						}
					}
				},
				storage: {
					local: {
						async get() {
							return {};
						}
					},
					session: {
						async get() {
							return {};
						},
						async set(values) {}
					}
				},
				tabs: {
					async get(id) {
						return {
							id,
							url: globalThis.location.toString(),
							title: 'Current'
						};
					},
					async query(query) {
						if (query.active && query.currentWindow) {
							return [
								{
									id: 'current'
								}
							];
						}

						return [];
					},
					sendMessage(...args) {
						pushMessage('tabs', args);
					},
					onUpdated: {
						addListener(listener) {
							pushListener('tabs', listener);
						},
						removeListener(listener) {
							removeListener('tabs', listener);
						}
					}
				}
			};
		});

		await this.page.route('/', async (route) => {
			await route.fulfill({path});
		});

		await this.page.goto('/');
	}

	async sendMessage(api: ExtensionApi, ...args) {
		return this.page.evaluate(
			async ([k, v]) => {
				for (const listener of globalThis.messageListeners[k]) {
					listener(...v);
				}
			},
			[api, args] as const
		);
	}

	async sentMessages(api: ExtensionApi): Promise<Action[]> {
		return this.page.evaluate(async (a) => {
			return globalThis.sentMessages[a] || [];
		}, api);
	}

	async lastSentMessage(api: ExtensionApi): Promise<Action | undefined> {
		const messages = await this.sentMessages(api);
		return messages.at(-1);
	}

	async expectNextSentMessage(api: ExtensionApi, ...args) {
		await expect(async () => {
			expect(await this.lastSentMessage(api)).toStrictEqual(args);
		}).toPass();
	}
}
