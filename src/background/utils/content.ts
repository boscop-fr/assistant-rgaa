const CONTENT_SCRIPTS = ['dist/helpers.js', 'dist/minimap.js'];
const CONTENT_STYLES = ['dist/helpers.css'];

export const injectContentScripts = async (tabId: number) =>
	Promise.all([
		browser.scripting.insertCSS({
			target: {tabId},
			files: CONTENT_STYLES
		}),
		browser.scripting.executeScript({
			target: {tabId},
			files: CONTENT_SCRIPTS
		})
	]);

export const removeContentScripts = async (tabId: number) =>
	browser.scripting.removeCSS({
		target: {tabId},
		files: CONTENT_STYLES
	});
