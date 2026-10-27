import {
	type PayloadAction,
	createAsyncThunk,
	createSlice
} from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';
import {appLoaded, helpersReady} from '../../background/slices/runtime';
import type {AppState as StoreState} from '../store';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {connectToTab} from '../utils/port';
import {fetchReference, flattenReference} from '../utils/reference';
import {resetResults} from './audit';
import {setHelpers} from './helpers';
import {setInstructions} from './instructions';
import {selectTargetTabId, setTabInfo} from './panel';
import {selectVersion, setReferenceData} from './reference';
import {loadState} from './storage';

type AppState = {
	isLoading: boolean;
	hasLoadError: boolean;
};

const initialState: AppState = {
	isLoading: true,
	hasLoadError: false
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLoading(state, {payload: isLoading}: PayloadAction<boolean>) {
			state.isLoading = isLoading;
		},
		setLoadError(state, {payload: hasError}: PayloadAction<boolean>) {
			state.hasLoadError = hasError;
		}
	},
	selectors: {
		selectIsLoading(state) {
			return state.isLoading;
		},
		selectHasLoadError(state) {
			return state.hasLoadError;
		}
	}
});

const {actions, reducer, selectors} = appSlice;
export const {setLoading, setLoadError} = actions;
export const {selectIsLoading, selectHasLoadError} = selectors;

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

	try {
		// Resolves once content scripts are injected.
		await browser.runtime.sendMessage(appLoaded({tabId}));
	} catch (e) {
		// Content scripts can't be injected in some pages
		// (i.e. browser pages), which shouldn't prevent the
		// panel from working.
		console.warn(e);
		return;
	}

	connectToTab(tabId);
	api.dispatch(helpersReady());
});

export default reducer;
