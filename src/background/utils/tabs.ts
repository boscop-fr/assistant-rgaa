import browser from 'webextension-polyfill';
import wait from '../../common/utils/wait';

export const PANEL_PAGE = 'pages/panel.html';

export const captureVisibleTab = async () => {
	try {
		return await browser.tabs.captureVisibleTab();
	} catch (e) {
		// We can't capture more than 2 screenshots per second,
		// so we're waiting a bit if we fall below the treshold.
		// @see https://groups.google.com/a/chromium.org/g/chromium-extensions/c/sQUlaHXjlhY
		if (e.message.includes('MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND')) {
			await wait(600);
			return await browser.tabs.captureVisibleTab();
		}

		throw e;
	}
};
