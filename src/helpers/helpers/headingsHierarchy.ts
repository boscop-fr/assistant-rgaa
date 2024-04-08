import {debounce} from 'lodash';
import {type IntlShape} from 'react-intl';
import {sendMessage} from '../../common/utils/runtime';
import HeadingsHierarchy from '../components/HeadingsHierarchy';
import {getHierarchy} from '../slices/headingsHierarchy';
import getHeadingsHierarchy, {
	withMissingHeadings
} from '../utils/getHeadingsHierarchy';

export const defaults = {
	// Whether or not to report missing heading levels.
	showMissing: true
};

const observers = new Map();

export const component = () => HeadingsHierarchy;

export const describe = (intl: IntlShape) =>
	intl.formatMessage({
		id: 'Helper.headingsHierarchy'
	});

export const apply = (id: string, {showMissing} = defaults) => {
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

export const revert = (id: string) => {
	const observer = observers.get(id);

	if (observer) {
		observer.disconnect();
		observers.delete(id);
	}
};
