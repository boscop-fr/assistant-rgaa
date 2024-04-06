import {createSlice} from '@reduxjs/toolkit';

const instructionsSlice = createSlice({
	name: 'instructions',
	initialState: {
		instructions: {}
	},
	reducers: {
		setInstructions(state, {payload: instructions}) {
			state.instructions = instructions; // eslint-disable-line no-param-reassign
		}
	},
	selectors: {
		selectInstructionsByTest(state, id) {
			return state.instructions?.[id]?.rgaa || state.instructions?.[id]?.all;
		}
	}
});

const {actions, reducer, selectors} = instructionsSlice;
export const {setInstructions} = actions;
export const {selectInstructionsByTest} = selectors;
export default reducer;
