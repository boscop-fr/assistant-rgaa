import {type Storage} from 'webextension-polyfill';

export type Options = {
	referenceVersion: string;
};

export const DEFAULT_OPTIONS: Options = {
	referenceVersion: '4-2023'
};

export const getAllOptions = () =>
	browser.storage.local.get().then(
		(options) =>
			({
				...DEFAULT_OPTIONS,
				...options
			}) as Options
	);

export const getOption = <K extends keyof Options>(
	key: K
): Promise<Options[K]> =>
	browser.storage.local
		.get(key)
		.then((options) =>
			key in options ? options[key] : DEFAULT_OPTIONS[key]
		);

export const setAllOptions = (options: Options) =>
	browser.storage.local.set(options);

export const setOption = <T>(key: keyof Options, value: T) =>
	browser.storage.local.set({
		[key]: value
	});

export const onOptionChange = <K extends keyof Options>(
	key: keyof Options,
	callback: (value: Options[K]) => void
) => {
	const onChange = (changes: Storage.StorageAreaOnChangedChangesType) => {
		if (key in changes && changes[key].oldValue !== changes[key].newValue) {
			callback(changes[key].newValue);
		}
	};

	browser.storage.local.onChanged.addListener(onChange);

	return () => {
		browser.storage.local.onChanged.removeListener(onChange);
	};
};
