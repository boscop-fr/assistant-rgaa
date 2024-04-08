import {createSlice} from '@reduxjs/toolkit';

type PanelState = {
	pageTabId: number;
	pageUrl: string;
	pageTitle: string;
	popupTabId: number;
};

const initialState: PanelState = {
	pageTabId: null,
	pageUrl: null,
	pageTitle: null,
	popupTabId: null
};

const panelSlice = createSlice({
	name: 'panel',
	initialState,
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
