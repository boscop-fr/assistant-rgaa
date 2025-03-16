import browser from 'webextension-polyfill';
import {closePopup, openPopup} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {
	selectPopupTabId,
	selectTargetTabId,
	togglePopup
} from '../slices/panel';
import {storeState} from '../slices/storage';

export const addPanelListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: togglePopup,
		async effect(action, api) {
			const state = api.getState();
			const tabId = selectTargetTabId(state);
			const popupTabId = selectPopupTabId(state);

			await api.dispatch(storeState()).unwrap();

			browser.runtime.sendMessage(
				popupTabId ? closePopup({tabId, popupTabId}) : openPopup({tabId})
			);
		}
	});
};
