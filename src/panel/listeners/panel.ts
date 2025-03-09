import {closePopup, openPopup} from '../../background/slices/runtime';
import {setTabState} from '../../common/utils/tabs';
import type {AppStartListening} from '../middlewares/listener';
import {selectPageTabId, selectPopupTabId, togglePopup} from '../slices/panel';

export const addPanelListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: togglePopup,
		effect(action, api) {
			const state = api.getState();
			const tabId = selectPageTabId(state);
			const popupTabId = selectPopupTabId(state);

			setTabState(tabId, state);

			browser.runtime.sendMessage(
				popupTabId ? closePopup({tabId, popupTabId}) : openPopup({tabId})
			);
		}
	});

	// Saves the whole state each time something changes.
	startListening({
		predicate: () => true,
		async effect(action, api) {
			// @see https://redux-toolkit.js.org/api/createListenerMiddleware#complex-async-workflows
			api.cancelActiveListeners();
			await api.delay(300);

			const state = api.getState();
			const tabId = selectPageTabId(state);

			setTabState(tabId, state);
		}
	});
};
