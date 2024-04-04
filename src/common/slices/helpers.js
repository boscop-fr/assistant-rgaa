import {createSlice} from '@reduxjs/toolkit';

const helpersSlice = createSlice({
	name: 'helpers',
	initialState: {
		helpers: {}
	},
	reducers: {
		setHelpers(state, {payload: helpers}) {
			state.helpers = helpers; // eslint-disable-line no-param-reassign
		},
		toggleHelpers() {}
	},
	selectors: {
		selectTestHasHelpers(state, id) {
			return !!state.helpers?.[id]?.length;
		},
		selectHelpersByTest(state, id) {
			return state.helpers?.[id] || [];
		}
	}
});

const {actions, reducer, selectors} = helpersSlice;
export const {setHelpers, toggleHelpers} = actions;
export const {selectTestHasHelpers, selectHelpersByTest} = selectors;
export default reducer;
