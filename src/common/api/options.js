export const OPTIONS = {
	referenceVersion: 'reference.version'
};

export const getOption = (key, defaultValue) =>
	browser.storage.local
		.get(key)
		.then((options) => (key in options ? options[key] : defaultValue));

export const setOption = (key, value) =>
	browser.storage.local.set({
		[key]: value
	});

export const onOptionChange = (key, callback) => {
	const onChange = (changes) => {
		if (key in changes && changes[key].oldValue !== changes[key].newValue) {
			callback(changes[key].newValue);
		}
	};

	browser.storage.local.onChanged.addListener(onChange);

	return () => {
		browser.storage.local.onChanged.removeListener(onChange);
	};
};
