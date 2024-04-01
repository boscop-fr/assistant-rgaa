const ContentScripts = ['dist/helpers.js', 'dist/minimap.js'];
const ContentStyles = ['dist/helpers.css'];

export const injectContentScripts = async (tabId) =>
	Promise.all([
		browser.scripting.insertCSS({
			target: {tabId},
			files: ContentStyles
		}),
		browser.scripting.executeScript({
			target: {tabId},
			files: ContentScripts
		})
	]);

export const removeContentScripts = async (tabId) =>
	browser.scripting.removeCSS({
		target: {tabId},
		files: ContentStyles
	});
