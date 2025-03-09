import debounce from 'debounce';
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

			const handleMessage = async (action: unknown) => {
				if (getHierarchy.match(action)) {
					sendHierarchy();
				}
			};

			browser.runtime.onMessage.addListener(handleMessage);

			const observer = new MutationObserver(debounce(sendHierarchy, 100));

			observer.observe(document.body, {
				childList: true
			});

			// We're sending the hierarchy once at start,
			// without waiting for the requesting message,
			// in case we missed it.
			sendHierarchy();

			return () => {
				browser.runtime.onMessage.removeListener(handleMessage);
				observer.disconnect();
			};
		};
	}
});
