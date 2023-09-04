import createStore from './createStore';
import {isOpen as isPanelOpen} from '../common/selectors/panel';

/**
 *	Creates an app instance, i.e. a container for data associated
 *	with a particular tab.
 */
export default function createAppInstance(tabId) {
	let popupId = false;

	//
	const isPopup = () => !!popupId;

	//
	const setPopup = (id) => {
		popupId = id;
	};

	//
	const removePopup = () => {
		popupId = null;
		return tabId;
	};

	// Sends a message to the instance's tabs.
	const sendMessage = (message) => {
		const responses = [browser.tabs.sendMessage(tabId, message)];

		if (popupId) {
			responses.push(browser.tabs.sendMessage(popupId, message));
		}

		return Promise.all(responses);
	};

	const store = createStore(`background-${tabId}`, sendMessage);

	const isOpen = () => isPanelOpen(store.getState());

	return {
		isPopup,
		setPopup,
		removePopup,
		sendMessage,
		isOpen,
		store,
		dispatch: store.dispatch
	};
}
