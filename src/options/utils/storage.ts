import {type Storage} from 'webextension-polyfill';

export const OPTIONS = {
	referenceVersion: 'reference.version'
};

export const getOption = <T>(key: string, defaultValue: T) =>
	browser.storage.local
		.get(key)
		.then((options) => (key in options ? options[key] : defaultValue));

export const setOption = <T>(key: string, value: T) =>
	browser.storage.local.set({
		[key]: value
	});

export const onOptionChange = <T>(
	key: string,
	callback: (value: T) => void
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
