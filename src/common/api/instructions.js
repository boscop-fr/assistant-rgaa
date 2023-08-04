/**
 *	Retrieve instructions mapping for the given version.
 */
export const fetchInstructions = (version) =>
	fetch(browser.runtime.getURL(`data/instructions/${version}.json`))
		.then((response) => response.json())
		.catch(() => ({}));
