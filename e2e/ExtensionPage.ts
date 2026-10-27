import {expect, type Page} from '@playwright/test';
import type {Action} from '@reduxjs/toolkit';

type ExtensionApi = 'runtime' | 'tabs' | 'storage' | 'connect' | 'port';

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

			// Fake port, kept as the current one. Messages posted
			// by the page are recorded as sent on the 'port' API.
			// Tests can deliver messages to the page through
			// `receive()`, and disconnect it through `close()`.
			globalThis.createPort = (name) => {
				const messageListeners = new Set();
				const disconnectListeners = new Set();
				const port = {
					name,
					postMessage(message) {
						pushMessage('port', [message]);
					},
					disconnect() {},
					onMessage: {
						addListener: (listener) => messageListeners.add(listener),
						removeListener: (listener) => messageListeners.delete(listener)
					},
					onDisconnect: {
						addListener: (listener) => disconnectListeners.add(listener),
						removeListener: (listener) => disconnectListeners.delete(listener)
					},
					receive(message) {
						for (const listener of messageListeners) {
							listener(message, port);
						}
					},
					close() {
						for (const listener of disconnectListeners) {
							listener(port);
						}
					}
				};

				globalThis.port = port;
				return port;
			};

			// Stubs the webext API.
			globalThis.browser = {
				runtime: {
					id: 'playwright',
					// Answers as the background does to `appLoaded`,
					// once content scripts are injected.
					async sendMessage(...args) {
						pushMessage('runtime', args);
						return true;
					},
					onConnect: {
						addListener(listener) {
							pushListener('connect', listener);
						},
						removeListener(listener) {
							removeListener('connect', listener);
						}
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
					connect(_tabId, {name}) {
						return globalThis.createPort(name);
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
	// the browser does. Listeners answer through
	// `sendResponse`, after returning `true`.
	async sendMessage(api: ExtensionApi, ...args) {
		return this.page.evaluate(
			async ([k, v]) => {
				const answers = await Promise.all(
					Array.from(globalThis.messageListeners[k]).map(
						(listener) =>
							new Promise((resolve) => {
								if (listener(...v, {}, resolve) !== true) {
									resolve(undefined);
								}
							})
					)
				);

				return answers.find((answer) => answer !== undefined);
			},
			[api, args] as const
		);
	}

	// Opens a port to the page, as a panel would.
	async connect(name = 'panel') {
		return this.page.evaluate((n) => {
			const port = globalThis.createPort(n);

			for (const listener of globalThis.messageListeners.connect ?? []) {
				listener(port);
			}
		}, name);
	}

	// Delivers a message to the page through the current port.
	async postToPort(message: unknown) {
		return this.page.evaluate((m) => {
			globalThis.port.receive(m);
		}, message);
	}

	async disconnectPort() {
		return this.page.evaluate(() => {
			globalThis.port.close();
		});
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
