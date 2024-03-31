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
		applyHelpers() {},
		applyAllHelpers() {},
		revertHelpers() {},
		revertAllHelpers() {}
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
export const {
	setHelpers,
	applyHelpers,
	applyAllHelpers,
	revertHelpers,
	revertAllHelpers
} = actions;
export const {selectTestHasHelpers, selectHelpersByTest} = selectors;
export default reducer;
