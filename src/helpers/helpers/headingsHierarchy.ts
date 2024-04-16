import debounce from 'debounce';
import {sendMessage} from '../../common/utils/runtime';
import HeadingsHierarchy from '../components/HeadingsHierarchy';
import {getHierarchy} from '../slices/headingsHierarchy';
import {createHelper} from '../utils/createHelper';
import getHeadingsHierarchy, {
	withMissingHeadings
} from '../utils/getHeadingsHierarchy';

type HeadingsHierarchyOptions = {
	// Whether or not to report missing heading levels.
	showMissing?: boolean;
};

const observers = new Map();

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
	apply(id, {showMissing = true}) {
		const sendHierarchy = () => {
			const hierarchy = getHeadingsHierarchy();

			sendMessage(
				getHierarchy(
					showMissing
						? withMissingHeadings(hierarchy, 'Titre manquant')
						: hierarchy
				)
			);
		};

		const observer = new MutationObserver(debounce(sendHierarchy, 300));
		observers.set(id, observer);
		observer.observe(document.body, {
			childList: true
		});

		sendHierarchy();
	},
	revert(id) {
		const observer = observers.get(id);

		if (observer) {
			observer.disconnect();
			observers.delete(id);
		}
	}
});
