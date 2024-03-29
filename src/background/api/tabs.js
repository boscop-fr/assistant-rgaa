export const PanelPage = 'pages/panel.html';

/**
 *
 */
export const captureVisibleTab = async (
	options = {
		format: 'png'
	}
) => {
	const source = await browser.tabs.captureVisibleTab(null, options);
	const image = new Image();
	image.src = source;

	return image;
};

/**
 *
 */
export const onUpdate = (callback) =>
	browser.tabs.onUpdated.addListener(callback);
