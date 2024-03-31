import {filter} from 'lodash';
import {createSelector, createSlice} from '@reduxjs/toolkit';
import {selectAllTests, selectTestsByCriterion} from './reference';

const testsSlice = createSlice({
	name: 'tests',
	initialState: {
		enabledIds: []
	},
	reducers: {
		enableTest(state, {payload: id}) {
			state.enabledIds.push(id);
		},
		disableTest(state, {payload: id}) {
			const index = state.enabledIds.findIndex(
				(enabledId) => id === enabledId
			);

			if (index >= 0) {
				state.enabledIds.splice(index, 1);
			}
		}
	},
	selectors: {
		selectIsTestEnabled(state, id) {
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
