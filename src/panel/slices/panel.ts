import {createAction, createSlice, type PayloadAction} from '@reduxjs/toolkit';

type PanelState = {
	targetTabId: number;
	targetTabUrl: string;
	targetTabTitle: string;
	popupTabId: number | null;
};

const initialState: PanelState = {
	// Set at startup, before anything reads them.
	targetTabId: -1,
	targetTabUrl: '',
	targetTabTitle: '',
	popupTabId: null
};

const panelSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setTabIds(
			state,
			{payload}: PayloadAction<{targetTabId: number; popupTabId: number | null}>
		) {
			state.targetTabId = payload.targetTabId;
			state.popupTabId = payload.popupTabId;
		},
		setTabInfo(state, {payload}: PayloadAction<{url: string; title: string}>) {
			state.targetTabUrl = payload.url;
			state.targetTabTitle = payload.title;
		}
	},
	selectors: {
		selectTargetTabId(state) {
			return state.targetTabId;
		},
		selectTargetTabTitle(state) {
			return state.targetTabTitle;
		},
		selectTargetTabUrl(state) {
			return state.targetTabUrl;
		},
		selectPopupTabId(state) {
			return state.popupTabId;
		}
	}
});

const {actions, reducer, selectors} = panelSlice;
export const {setTabIds, setTabInfo} = actions;
export const togglePopup = createAction('panel/togglePopup');
export const {
	selectTargetTabId,
	selectTargetTabTitle,
	selectTargetTabUrl,
	selectPopupTabId
} = selectors;

export default reducer;
