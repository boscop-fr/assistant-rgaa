import {
	createAsyncThunk,
	createSlice,
	type PayloadAction
} from '@reduxjs/toolkit';
import {appLoaded} from '../../background/slices/runtime';
import {browser} from '../../common/utils/webExtension';
import type {AppState as StoreState} from '../store';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {connectToTab} from '../utils/port';
import {fetchReference, flattenReference} from '../utils/reference';
import {resetResults} from './audit';
import {helpersReady, setHelpers} from './helpers';
import {setInstructions} from './instructions';
import {selectTargetTabId, setTabInfo} from './panel';
import {selectVersion, setReferenceData} from './reference';
import {loadState, storeState} from './storage';

type AppState = {
	// Prevents saving the state while the stored one isn't
	// loaded yet, as it would be overwritten.
	isAutoSavePaused: boolean;
	hasLoadError: boolean;
};

const initialState: AppState = {
	isAutoSavePaused: true,
	hasLoadError: false
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		pauseAutoSave(state, {payload: isPaused}: PayloadAction<boolean>) {
			state.isAutoSavePaused = isPaused;
		},
		setLoadError(state, {payload: hasError}: PayloadAction<boolean>) {
			state.hasLoadError = hasError;
		}
	},
	selectors: {
		selectIsAutoSavePaused(state) {
			return state.isAutoSavePaused;
		},
		selectHasLoadError(state) {
			return state.hasLoadError;
		}
	}
});

const {actions, reducer, selectors} = appSlice;
export const {pauseAutoSave, setLoadError} = actions;
export const {selectIsAutoSavePaused, selectHasLoadError} = selectors;

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

// Loads another version of the reference, along with the
// state stored for it.
export const switchReferenceVersion = createAsyncThunk(
	'app/switchReferenceVersion',
	async (version: string, api) => {
		// Saves the current state right away, as a pending
		// auto save would be skipped while paused.
		await api.dispatch(storeState()).unwrap();

		// The auto save would otherwise overwrite the state stored for the new version
		// with an empty one.
		api.dispatch(pauseAutoSave(true));

		try {
			await api.dispatch(loadReference(version)).unwrap();
			await api.dispatch(loadState()).unwrap();
		} finally {
			api.dispatch(pauseAutoSave(false));
		}
	}
);

export const loadTab = createAsyncThunk('app/loadTab', async (_, api) => {
	const tabId = selectTargetTabId(api.getState() as StoreState);
	const tab = await browser.tabs.get(tabId);

	// Unlike the tab id, the URL and title might
	// change between reloads.
	api.dispatch(
		setTabInfo({
			url: tab.url ?? '',
			title: tab.title ?? ''
		})
	);

	// Loading persisted state is done after updating
	// the page info, since this info is used to find
	// the according state.
	await api.dispatch(loadState()).unwrap();

	// Resolves once content scripts are injected, telling if
	// they could be, which shouldn't prevent the panel from
	// working otherwise.
	if (!(await browser.runtime.sendMessage(appLoaded({tabId})))) {
		return;
	}

	connectToTab(tabId);
	api.dispatch(helpersReady());
});

export default reducer;
