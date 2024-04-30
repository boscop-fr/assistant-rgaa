import {
	type PayloadAction,
	createAction,
	createSelector,
	createSlice
} from '@reduxjs/toolkit';
import {type Test} from '../../common/types';
import {selectAllTests, selectTestsByCriterion} from './reference';

type TestsState = {
	enabledIds: Test['id'][];
};

const initialState: TestsState = {
	enabledIds: []
};

const testsSlice = createSlice({
	name: 'tests',
	initialState,
	reducers: {
		toggleTest(
			state,
			action: PayloadAction<{
				id: Test['id'];
				isExclusive: boolean;
				toggle: boolean;
			}>
		) {
			const {id, isExclusive, toggle} = action.payload;

			state.enabledIds = isExclusive
				? toggle
					? [id]
					: []
				: toggle
					? state.enabledIds.concat(id)
					: state.enabledIds.filter((i) => i !== id);
		}
	},
	selectors: {
		selectIsTestEnabled(state, id: Test['id']) {
			return state.enabledIds.includes(id);
		},
		selectEnabledTestIds(state) {
			return state.enabledIds;
		}
	}
});

const {actions, reducer, selectors} = testsSlice;
export const {toggleTest} = actions;
export const {selectIsTestEnabled, selectEnabledTestIds} = selectors;

export const autoToggleTest = createAction<{id: Test['id']; toggle: boolean}>(
	'tests/autoToggleTest'
);

export const selectEnabledTests = createSelector(
	[selectAllTests, selectEnabledTestIds],
	(tests, ids) => Object.values(tests).filter(({id}) => ids.includes(id))
);

export const selectEnabledTestsByCriterion = createSelector(
	[selectTestsByCriterion, selectEnabledTestIds],
	(tests, ids) => tests.filter(({id}) => ids.includes(id))
);

export default reducer;
