import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	tests: {}
};

const checklistSlice = createSlice({
	name: 'checklist',
	initialState,
	reducers: {
		markTestDone(state, {payload}) {
			state.tests[payload.id] = payload.done; // eslint-disable-line no-param-reassign
		},
		resetChecklist(state) {
			state = initialState; // eslint-disable-line no-param-reassign, no-unused-vars
		}
	},
	selectors: {
		selectIsTestDone(state, id) {
			return state.tests?.[id];
		},
		selectAreAllTestsDone(state, tests) {
			return tests.every(({id}) => state.tests?.[id]);
		}
	}
});

const {actions, reducer, selectors} = checklistSlice;
export const {markTestDone, resetChecklist} = actions;
export const {selectIsTestDone, selectAreAllTestsDone} = selectors;
export default reducer;
