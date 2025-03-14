import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import type {HelpersByTest, Test} from '../../common/types';
import type {Helper} from '../../helpers/types';

type HelpersState = {
	helpers: HelpersByTest;
	globalHelpers: Record<string, Helper>;
};

const initialState: HelpersState = {
	helpers: {},
	globalHelpers: {}
};

const helpersSlice = createSlice({
	name: 'helpers',
	initialState,
	reducers: {
		setHelpers(state, {payload: helpers}: PayloadAction<HelpersByTest>) {
			state.helpers = helpers;
		},
		setGlobalHelper(
			state,
			action: PayloadAction<{id: string; helper: Helper}>
		) {
			const {id, helper} = action.payload;
			state.globalHelpers[id] = helper;
		},
		removeGlobalHelper(state, {payload: id}: PayloadAction<string>) {
			delete state.globalHelpers[id];
		},
		applyHelpers(state, action: PayloadAction<Helper[]>) {},
		revertActiveHelpers() {}
	},
	selectors: {
		selectGlobalHelpers(state) {
			return Object.values(state.globalHelpers);
		},
		selectTestHasHelpers(state, id: Test['id']) {
			return !!state.helpers?.[id]?.length;
		},
		selectHelpersByTest(state, id: Test['id']) {
			return state.helpers?.[id] || [];
		},
		selectHelpersByTests(state, ids: Test['id'][]) {
			return ids.flatMap((id) => state.helpers?.[id] || []);
		}
	}
});

const {actions, reducer, selectors} = helpersSlice;

export const {
	setHelpers,
	setGlobalHelper,
	removeGlobalHelper,
	applyHelpers,
	revertActiveHelpers
} = actions;

export const {
	selectGlobalHelpers,
	selectTestHasHelpers,
	selectHelpersByTest,
	selectHelpersByTests
} = selectors;

export default reducer;
