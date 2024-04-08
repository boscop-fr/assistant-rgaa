import {createSlice} from '@reduxjs/toolkit';
import {closePopup, openPopup} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/runtime';
import {setTabState} from '../../common/utils/tabs';

const panelSlice = createSlice({
	name: 'panel',
	initialState: {
		pageTabId: null,
		pageUrl: null,
		pageTitle: null,
		popupTabId: null
	},
	reducers: {
		setPageInfo(state, {payload}) {
			state.pageTabId = payload.tabId; // eslint-disable-line no-param-reassign
			state.pageUrl = payload.url; // eslint-disable-line no-param-reassign
			state.pageTitle = payload.title; // eslint-disable-line no-param-reassign
			state.popupTabId = payload.popupTabId; // eslint-disable-line no-param-reassign
		},
		togglePopup() {}
	},
	selectors: {
		selectPageTabId(state) {
			return state.pageTabId;
		},
		selectPageTitle(state) {
			return state.pageTitle;
		},
		selectPageUrl(state) {
			return state.pageUrl;
		},
		selectPopupTabId(state) {
			return state.popupTabId;
		}
	}
});

const {actions, reducer, selectors} = panelSlice;
export const {setPageInfo, togglePopup} = actions;
export const {
	selectPageTabId,
	selectPageTitle,
	selectPageUrl,
	selectPopupTabId
} = selectors;

export const addPanelListeners = (startListening) => {
	startListening({
		actionCreator: togglePopup,
		effect(action, api) {
			const state = api.getState();
			const tabId = selectPageTabId(state);
			const popupTabId = selectPopupTabId(state);

			setTabState(tabId, state);
			sendMessage(
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

export default reducer;
