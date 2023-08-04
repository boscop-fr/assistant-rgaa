/*
 * retrieve the helpers mapping full json object from a given reference version
 */
export const getHelpers = (version) =>
	fetch(browser.runtime.getURL(`data/helpers/${version}.json`))
		.then((response) => response.json())
		.catch(() => ({}));
