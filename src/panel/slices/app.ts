import {
	type PayloadAction,
	createAsyncThunk,
	createSlice
} from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';
import {appLoaded} from '../../background/slices/runtime';
import type {AppState as StoreState} from '../store';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {fetchReference, flattenReference} from '../utils/reference';
import {resetResults} from './audit';
import {setHelpers} from './helpers';
import {setInstructions} from './instructions';
import {selectTargetTabId, setTabInfo} from './panel';
import {selectVersion, setReferenceData} from './reference';
import {loadState} from './storage';

type AppState = {
	isLoading: boolean;
};

const initialState: AppState = {
	isLoading: true
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLoading(state, {payload: isLoading}: PayloadAction<boolean>) {
			state.isLoading = isLoading;
		}
	},
	selectors: {
		selectIsLoading(state) {
			return state.isLoading;
		}
	}
});

const {actions, reducer, selectors} = appSlice;
export const {setLoading} = actions;
export const {selectIsLoading} = selectors;

export const loadReference = createAsyncThunk(
	'app/loadReference',
	async (version: string, api) => {
		const reference = await fetchReference(version);
		const currentVersion = selectVersion(api.getState() as StoreState);

		if (reference.version === currentVersion) {
			return;
		}

		const [helpers, instructions] = await Promise.all([
			fetchHelpers(version),
			fetchInstructions(version)
		]);

		api.dispatch(resetResults());
		api.dispatch(setReferenceData(flattenReference(reference)));
		api.dispatch(setHelpers(helpers));
		api.dispatch(setInstructions(instructions));
	}
);

export const loadTab = createAsyncThunk('app/loadTab', async (_, api) => {
	const tabId = selectTargetTabId(api.getState() as StoreState);
	const tab = await browser.tabs.get(tabId);

	// Unlike the tab id, the URL and title might
	// change between reloads.
	api.dispatch(
		setTabInfo({
			url: tab.url,
			title: tab.title
		})
	);

	// Loading persisted state is done after updating
	// the page info, since this info is used to find
	// the according state.
	await api.dispatch(loadState()).unwrap();

	browser.runtime.sendMessage(appLoaded({tabId}));
});

export default reducer;
