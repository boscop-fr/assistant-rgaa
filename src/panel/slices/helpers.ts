import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Helper, HelpersByTest, Test} from '../../common/types';

type HelpersState = {
	helpers: HelpersByTest;
};

const initialState: HelpersState = {
	helpers: {}
};

const helpersSlice = createSlice({
	name: 'helpers',
	initialState,
	reducers: {
		setHelpers(state, {payload: helpers}: PayloadAction<HelpersByTest>) {
			state.helpers = helpers; // eslint-disable-line no-param-reassign
		},
		toggleHelpers(
			state,
			action: PayloadAction<{
				id: Test['id'];
				helpers: Helper[];
				enabled: boolean;
			}>
		) {}
	},
	selectors: {
		selectTestHasHelpers(state, id: Test['id']) {
			return !!state.helpers?.[id]?.length;
		},
		selectHelpersByTest(state, id: Test['id']) {
			return state.helpers?.[id] || [];
		}
	}
});

const {actions, reducer, selectors} = helpersSlice;
export const {setHelpers, toggleHelpers} = actions;
export const {selectTestHasHelpers, selectHelpersByTest} = selectors;
export default reducer;
