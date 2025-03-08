const CONTENT_SCRIPTS = ['dist/helpers.js', 'dist/minimap.js'];
const CONTENT_STYLES = ['dist/helpers.css'];

const areScriptsInjected = async (tabId: number) => {
	const results = await browser.scripting.executeScript({
		target: {tabId},
		func() {
			return document.body.dataset?.rgaaExt === 'true';
		}
	});

	return !!results?.[0]?.result;
};

const setScriptsInjected = (tabId: number) =>
	browser.scripting.executeScript({
		target: {tabId},
		func() {
			document.body.dataset.rgaaExt = 'true';
		}
	});

export const injectContentScripts = async (tabId: number) => {
	if (await areScriptsInjected(tabId)) {
		return Promise.resolve();
	}

	return Promise.all([
		setScriptsInjected(tabId),
		browser.scripting.insertCSS({
			target: {tabId},
			files: CONTENT_STYLES
		}),
		browser.scripting.executeScript({
			target: {tabId},
			files: CONTENT_SCRIPTS
		})
	]);
};
