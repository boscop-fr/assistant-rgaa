const HelpersScripts = ['dist/helpers.js'];
const HelpersStyles = ['dist/helpers.css'];

export const injectHelpersScripts = async (tabId) =>
	Promise.all([
		browser.scripting.insertCSS({
			target: {tabId},
			files: HelpersStyles
		}),
		browser.scripting.executeScript({
			target: {tabId},
			files: HelpersScripts
		})
	]);

export const removeHelpersScripts = async (tabId) =>
	browser.scripting.removeCSS({
		target: {tabId},
		files: HelpersStyles
	});
