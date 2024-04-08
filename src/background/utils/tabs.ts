import {type ExtensionTypes} from 'webextension-polyfill';

export const PANEL_PAGE = 'pages/panel.html';

export const captureVisibleTab = async (
	options: ExtensionTypes.ImageDetails = {
		format: 'png'
	}
) => {
	const source = await browser.tabs.captureVisibleTab(null, options);
	const image = new Image();
	image.src = source;

	return image;
};
