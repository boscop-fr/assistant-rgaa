import {createSlice} from '@reduxjs/toolkit';

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
export default reducer;
