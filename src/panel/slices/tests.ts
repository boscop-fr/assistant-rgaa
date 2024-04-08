import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {filter} from 'lodash';
import {Test} from '../../common/types';
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
		enableTest(state, {payload: id}: PayloadAction<Test['id']>) {
			state.enabledIds.push(id);
		},
		disableTest(state, {payload: id}: PayloadAction<Test['id']>) {
			const index = state.enabledIds.findIndex(
				(enabledId) => id === enabledId
			);

			if (index >= 0) {
				state.enabledIds.splice(index, 1);
			}
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
export const {enableTest, disableTest} = actions;
export const {selectIsTestEnabled, selectEnabledTestIds} = selectors;

export const selectEnabledTests = createSelector(
	[selectAllTests, selectEnabledTestIds],
	(tests, ids) => filter(tests, ({id}) => ids.includes(id))
);

export const selectEnabledTestsByCriterion = createSelector(
	[selectTestsByCriterion, selectEnabledTestIds],
	(tests, ids) => filter(tests, ({id}) => ids.includes(id))
);

export default reducer;
