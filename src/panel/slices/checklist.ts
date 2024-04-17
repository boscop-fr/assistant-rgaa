import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Test} from '../../common/types';

type ChecklistState = {
	tests: Record<Test['id'], boolean>;
};

const initialState: ChecklistState = {
	tests: {}
};

const checklistSlice = createSlice({
	name: 'checklist',
	initialState,
	reducers: {
		markTestDone(
			state,
			{payload}: PayloadAction<{id: Test['id']; done: boolean}>
		) {
			state.tests[payload.id] = payload.done; // eslint-disable-line no-param-reassign
		},
		resetChecklist() {
			return initialState; // eslint-disable-line no-param-reassign, no-unused-vars
		}
	},
	selectors: {
		selectIsTestDone(state, id) {
			return state.tests?.[id];
		},
		selectAreAllTestsDone(state, tests: Test[]) {
			return tests.every(({id}) => state.tests?.[id]);
		}
	}
});

const {actions, reducer, selectors} = checklistSlice;
export const {markTestDone, resetChecklist} = actions;
export const {selectIsTestDone, selectAreAllTestsDone} = selectors;
export default reducer;
