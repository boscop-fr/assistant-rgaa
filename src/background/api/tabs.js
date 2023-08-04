/**
 *
 */
export const CONTENT_SCRIPTS = ['dist/container.js', 'dist/helpers.js'];

/**
 *
 */
export const CONTENT_STYLES = ['dist/container.css', 'dist/helpers.css'];

/**
 *
 */
export const fetchCurrentTab = async () => {
	const query = {
		active: true,
		currentWindow: true
	};

	const tabs = await browser.tabs.query(query);

	if (!tabs.length) {
		throw new Error('No tab found');
	}

	return tabs[0];
};

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
export const closeTab = (id) => browser.tabs.remove(id);

/**
 *
 */
export const onUpdate = (callback) =>
	browser.tabs.onUpdated.addListener(callback);
