import {useEffect, useState} from 'react';
import type {Storage} from 'webextension-polyfill';

export type StatePersistence = 'always' | 'tab' | 'url' | 'tabUrl';

export type Options = {
	referenceVersion: string;
	allowMultipleTests: boolean;
	autoOpenInstructions: boolean;
	statePersistence: StatePersistence;
};

export const DEFAULT_OPTIONS: Options = {
	referenceVersion: '4-2023',
	allowMultipleTests: false,
	autoOpenInstructions: true,
	statePersistence: 'tabUrl'
};

export const isBooleanOption = (key: keyof Options) =>
	typeof DEFAULT_OPTIONS[key] === 'boolean';

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
		.then((options: Options) =>
			key in options ? options[key] : DEFAULT_OPTIONS[key]
		);

export const setAllOptions = (options: Options) =>
	browser.storage.local.set(options);

export const onOptionChange = <K extends keyof Options>(
	key: keyof Options,
	callback: (value: Options[K]) => void,
	initial = false
) => {
	const onChange = (changes: Storage.StorageAreaOnChangedChangesType) => {
		if (key in changes && changes[key].oldValue !== changes[key].newValue) {
			callback(changes[key].newValue as Options[K]);
		}
	};

	browser.storage.local.onChanged.addListener(onChange);

	if (initial) {
		getOption(key).then(callback);
	}

	return () => {
		browser.storage.local.onChanged.removeListener(onChange);
	};
};

export const useOption = (key: keyof Options) => {
	const [value, setValue] = useState(DEFAULT_OPTIONS[key]);
	useEffect(onOptionChange(key, setValue, true));
	return value;
};
