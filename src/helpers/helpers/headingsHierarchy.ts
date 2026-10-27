import debounce from 'debounce';
import browser from 'webextension-polyfill';
import HeadingsHierarchy from '../components/HeadingsHierarchy';
import {getHierarchy, setHierarchy} from '../slices/headingsHierarchy';
import {createHelper} from '../utils/createHelper';
import getHeadingsHierarchy from '../utils/getHeadingsHierarchy';

type HeadingsHierarchyOptions = {
	// Whether or not to report missing heading levels.
	showMissing?: boolean;
};

export default createHelper({
	name: 'headingsHierarchy',
	defaultOptions: {
		showMissing: true
	} as HeadingsHierarchyOptions,
	component: HeadingsHierarchy,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.headingsHierarchy'
		});
	},
	apply() {
		return () => {
			const sendHierarchy = () => {
				browser.runtime.sendMessage(setHierarchy(getHeadingsHierarchy()));
			};

			// Answers requests with the current hierarchy.
			// This must not return anything for other messages,
			// as the first listener returning a promise answers
			// the message.
			const handleMessage = (action: unknown) => {
				if (getHierarchy.match(action)) {
					return Promise.resolve(getHeadingsHierarchy());
				}
			};

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
	}
});
