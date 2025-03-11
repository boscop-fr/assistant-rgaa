import {type PayloadAction, createSlice} from '@reduxjs/toolkit';

type PanelState = {
	targetTabId: number;
	targetTabUrl: string;
	targetTabTitle: string;
	popupTabId: number;
};

const initialState: PanelState = {
	targetTabId: null,
	targetTabUrl: null,
	targetTabTitle: null,
	popupTabId: null
};

const panelSlice = createSlice({
	name: 'panel',
	initialState,
	reducers: {
		setTabIds(
			state,
			{payload}: PayloadAction<{targetTabId: number; popupTabId: number}>
		) {
			state.targetTabId = payload.targetTabId;
			state.popupTabId = payload.popupTabId;
		},
		setTabInfo(
			state,
			{payload}: PayloadAction<{url: string; title: string}>
		) {
			state.targetTabUrl = payload.url;
			state.targetTabTitle = payload.title;
		},
		togglePopup() {}
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
export const {setTabIds, setTabInfo, togglePopup} = actions;
export const {
	selectTargetTabId,
	selectTargetTabTitle,
	selectTargetTabUrl,
	selectPopupTabId
} = selectors;

export default reducer;
