import {debounce} from 'lodash';
import {sendMessage} from '../../common/api/runtime';
import getHeadingsHierarchy, {
	withMissingHeadings
} from '../api/getHeadingsHierarchy';
import {getHierarchy} from '../actions/headingsHierarchy';
import HeadingsHierarchy from '../components/HeadingsHierarchy';

/**
 *	@var {boolean} showMissing - Whether or not to report
 *		missing heading levels.
 */
export const defaults = {
	showMissing: true
};

/**
 *
 */
const observers = new Map();

/**
 *
 */
export const component = () => HeadingsHierarchy;

/**
 *	Describes the helper.
 */
export const describe = (intl) =>
	intl.formatMessage({
		id: 'Helper.headingsHierarchy'
	});

/**
 *
 */
export const apply = (id, {showMissing} = defaults) => {
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
};

/**
 *
 */
export const revert = (id) => {
	const observer = observers.get(id);

	if (observer) {
		observer.disconnect();
		observers.delete(id);
	}
};
