import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import {HelpersByTest, Test} from '../../common/types';
import {Helper} from '../../helpers/types';

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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			state,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
