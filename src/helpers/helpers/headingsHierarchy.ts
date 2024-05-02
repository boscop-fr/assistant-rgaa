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

let observer: MutationObserver = null;

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
	apply({showMissing = true}) {
		return () => {
			if (!observer) {
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

				observer = new MutationObserver(debounce(sendHierarchy, 300));
				observer.observe(document.body, {
					childList: true
				});

				sendHierarchy();
			}

			return () => {
				if (observer) {
					observer.disconnect();
					observer = null;
				}
			};
		};
	}
});
