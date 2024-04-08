import {type Browser} from 'webextension-polyfill';

declare global {
	const browser: Browser;

	type PanelOptions = {
		tabId?: number;
		enabled?: boolean;
		path?: string;
	};

	type OpenOptions = {
		tabId?: number;
		windowId?: string;
	};

	const chrome: {
		sidePanel: {
			setOptions(options: PanelOptions): void;
			open(options: OpenOptions): void;
		};
	};
}
