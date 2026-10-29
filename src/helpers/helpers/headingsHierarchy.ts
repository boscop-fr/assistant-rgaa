import debounce from 'debounce';
import {answerMessages, browser} from '../../common/utils/webExtension';
import {getHierarchy, setHierarchy} from '../slices/headingsHierarchy';
import type {Effect} from '../types';
import getHeadingsHierarchy from '../utils/getHeadingsHierarchy';
import {sendToPanel} from '../utils/panel';

export default (): Effect => () => {
	const sendHierarchy = () => {
		sendToPanel(setHierarchy(getHeadingsHierarchy()));
	};

	// Answers requests with the current hierarchy.
	const handleMessage = answerMessages((action) => {
		if (getHierarchy.match(action)) {
			return Promise.resolve(getHeadingsHierarchy());
		}
	});

	browser.runtime.onMessage.addListener(handleMessage);

	const debouncedSendHierarchy = debounce(sendHierarchy, 100);
	const observer = new MutationObserver(debouncedSendHierarchy);

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	// We're sending the hierarchy once at start, as the
	// panel might have requested it before this helper
	// was applied.
	sendHierarchy();

	return () => {
		browser.runtime.onMessage.removeListener(handleMessage);
		observer.disconnect();
		debouncedSendHierarchy.clear();
	};
};
