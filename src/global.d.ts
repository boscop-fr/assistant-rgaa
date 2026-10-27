declare global {
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

export {};
