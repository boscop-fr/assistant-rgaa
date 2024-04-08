import {createSelector, createSlice} from '@reduxjs/toolkit';
import {filter} from 'lodash';
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

export const addTestsListeners = (startListening) => {
	startListening({
		actionCreator: enableTest,
		effect({payload: id}, api) {
			// disables previously enabled tests
			const state = api.getState();
			const enabledIds = selectEnabledTestIds(state);

			enabledIds.forEach((otherId) => {
				if (otherId !== id) {
					api.dispatch(disableTest(otherId));
				}
			});
		}
	});
};

export default reducer;
