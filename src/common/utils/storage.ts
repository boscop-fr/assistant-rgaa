export const getData = async <T>(key: string, defaultData: T) => {
	const data = await browser.storage.session.get([key]);
	return data?.[key] || defaultData;
};

export const setData = <T>(key: string, data: T) =>
	browser.storage.session.set({
		[key]: data
	});

export const clearData = (key: string) => browser.storage.session.remove([key]);
