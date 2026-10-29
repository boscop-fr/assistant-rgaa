import {expect, type Page} from '@playwright/test';
import type {Action} from '@reduxjs/toolkit';

type ExtensionApi = 'runtime' | 'tabs' | 'storage' | 'connect' | 'port';

type Listener = (...args: unknown[]) => unknown;

type FakePort = {
	name: string;
	receive(message: unknown): void;
	close(): void;
};

// Test doubles living in the page.
declare global {
	var messageListeners: Record<string, Set<Listener>>;
	var sentMessages: Record<string, unknown[]>;
	var createPort: (name: string) => FakePort;
	var port: FakePort;
	var browser: unknown;
}

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
			const sessionData: Record<string, unknown> = {};

			const pushListener = (api: string, listener: Listener) => {
				if (!(api in globalThis.messageListeners)) {
					globalThis.messageListeners[api] = new Set();
				}

				globalThis.messageListeners[api].add(listener);
			};

			const removeListener = (api: string, listener: Listener) => {
				globalThis.messageListeners[api].delete(listener);
			};

			const pushMessage = (api: string, args: unknown[]) => {
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
				const messageListeners = new Set<Listener>();
				const disconnectListeners = new Set<Listener>();
				const port = {
					name,
					postMessage(message: unknown) {
						pushMessage('port', [message]);
					},
					disconnect() {},
					onMessage: {
						addListener: (listener: Listener) => messageListeners.add(listener),
						removeListener: (listener: Listener) =>
							messageListeners.delete(listener)
					},
					onDisconnect: {
						addListener: (listener: Listener) =>
							disconnectListeners.add(listener),
						removeListener: (listener: Listener) =>
							disconnectListeners.delete(listener)
					},
					receive(message: unknown) {
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
					async sendMessage(...args: unknown[]) {
						pushMessage('runtime', args);
						return true;
					},
					onConnect: {
						addListener(listener: Listener) {
							pushListener('connect', listener);
						},
						removeListener(listener: Listener) {
							removeListener('connect', listener);
						}
					},
					onMessage: {
						addListener(listener: Listener) {
							pushListener('runtime', listener);
						},
						removeListener(listener: Listener) {
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
							addListener(listener: Listener) {
								pushListener('storage', listener);
							},
							removeListener(listener: Listener) {
								removeListener('storage', listener);
							}
						}
					},
					session: {
						async get(keys: string[]) {
							return Object.fromEntries(
								keys
									.filter((key) => key in sessionData)
									.map((key) => [key, structuredClone(sessionData[key])])
							);
						},
						async set(values: Record<string, unknown>) {
							Object.assign(sessionData, structuredClone(values));
						}
					}
				},
				tabs: {
					async get(id: number) {
						return {
							id,
							url: globalThis.location.toString(),
							title: 'Current'
						};
					},
					async query(query: {active?: boolean; currentWindow?: boolean}) {
						if (query.active && query.currentWindow) {
							return [
								{
									id: 'current'
								}
							];
						}

						return [];
					},
					async sendMessage(...args: unknown[]) {
						pushMessage('tabs', args);
					},
					connect(_tabId: number, {name}: {name: string}) {
						return globalThis.createPort(name);
					},
					onUpdated: {
						addListener(listener: Listener) {
							pushListener('tabs', listener);
						},
						removeListener(listener: Listener) {
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
	async sendMessage(api: ExtensionApi, ...args: unknown[]) {
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
			return (globalThis.sentMessages[a] || []) as Action[];
		}, api);
	}

	async lastSentMessage(api: ExtensionApi): Promise<Action | undefined> {
		const messages = await this.sentMessages(api);
		return messages.at(-1);
	}

	async expectNextSentMessage(api: ExtensionApi, ...args: unknown[]) {
		await expect(async () => {
			expect(await this.lastSentMessage(api)).toStrictEqual(args);
		}).toPass();
	}
}
