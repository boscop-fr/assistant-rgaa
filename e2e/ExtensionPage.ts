import {type Page, expect} from '@playwright/test';
import type {Action} from '@reduxjs/toolkit';

type ExtensionApi = 'runtime' | 'tabs' | 'storage';

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
			const sessionData = {};

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
					async sendMessage(...args) {
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
						},
						onChanged: {
							addListener(listener) {
								pushListener('storage', listener);
							},
							removeListener(listener) {
								removeListener('storage', listener);
							}
						}
					},
					session: {
						async get(keys) {
							return Object.fromEntries(
								keys
									.filter((key) => key in sessionData)
									.map((key) => [key, structuredClone(sessionData[key])])
							);
						},
						async set(values) {
							Object.assign(sessionData, structuredClone(values));
						}
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
					async sendMessage(...args) {
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

	// Calls every listener, and returns the first answer, as
	// the browser does.
	async sendMessage(api: ExtensionApi, ...args) {
		return this.page.evaluate(
			async ([k, v]) => {
				const answers = Array.from(globalThis.messageListeners[k]).map(
					(listener) => listener(...v)
				);

				return answers.find((answer) => answer !== undefined);
			},
			[api, args] as const
		);
	}

	// Notifies listeners that an option changed in the local
	// storage.
	async changeOption(key: string, oldValue: unknown, newValue: unknown) {
		return this.sendMessage('storage', {[key]: {oldValue, newValue}});
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
