import {
	type Action,
	type Reducer,
	createAction,
	createAsyncThunk,
	createSelector
} from '@reduxjs/toolkit';
import {omit} from '../../common/utils/objects';
import {type StatePersistence, getOption} from '../../options/utils/storage';
import {type AppState} from '../store';
import {selectTargetTabId, selectTargetTabUrl} from './panel';
import {selectVersion} from './reference';

type StoredState = Partial<AppState>;

const SKIPPED_SLICES: Array<keyof AppState> = [
	'app',
	'helpers',
	'instructions',
	'panel',
	'reference'
];

// State is keyed by info about the extension, reference,
// tab and URL, so it doesn't get mixed up over reloads, URL
// changes, version changes etc.
// The specificity of the generated key is dictated by the
// given state persistence mode.
const selectStorageKey = createSelector(
	[
		selectVersion,
		selectTargetTabId,
		selectTargetTabUrl,
		(_, persistence: StatePersistence) => persistence
	],
	(version, tabId, fullUrl, persistence) => {
		const parts = [process.env.VERSION, version];
		const {hostname, pathname} = new URL(fullUrl);
		const url = hostname + pathname;

		switch (persistence) {
			case 'always':
				break;

			case 'tab':
				parts.push(tabId.toString());
				break;

			case 'url':
				parts.push(url);
				break;

			case 'tabUrl':
				parts.push(tabId.toString(), url);
				break;
		}

		return parts.join('/');
	}
);

const selectStorableState = createSelector(
	(state: AppState) => state,
	(state): StoredState => omit(state, SKIPPED_SLICES)
);

export const stateLoaded = createAction<AppState | undefined>(
	'storage/stateLoaded'
);

export const stateReset = () => stateLoaded();

export const loadState = createAsyncThunk(
	'storage/loadState',
	async (_, api) => {
		const persistence = await getOption('statePersistence');
		const key = selectStorageKey(api.getState() as AppState, persistence);
		const data: Record<string, StoredState> = await browser.storage.session.get(
			[key]
		);

		api.dispatch(
			stateLoaded(key in data ? (data[key] as AppState) : undefined)
		);
	}
);

export const storeState = createAsyncThunk(
	'storage/storeState',
	async (_, api) => {
		const persistence = await getOption('statePersistence');
		const state = api.getState() as AppState;
		const key = selectStorageKey(state, persistence);
		await browser.storage.session.set({
			[key]: selectStorableState(state)
		});
	}
);

export const storable = (reducer: Reducer<AppState>): Reducer<AppState> => {
	const initialState = reducer({} as AppState, {} as Action);
	const relevantInitialState = omit(initialState, SKIPPED_SLICES);

	return (state, action) => {
		if (stateLoaded.match(action)) {
			return reducer(
				{
					...state,
					...relevantInitialState,
					...(action.payload || {})
				},
				action
			);
		}

		return reducer(state, action);
	};
};
