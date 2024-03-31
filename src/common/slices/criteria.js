import {createSlice} from '@reduxjs/toolkit';

const criteriaSlice = createSlice({
	name: 'criteria',
	initialState: {
		opened: []
	},
	reducers: {
		openCriterion(state, {payload: id}) {
			state.opened.push(id);
		},
		closeCriterion(state, {payload: id}) {
			const index = state.opened.findIndex((openedId) => id === openedId);

			if (index >= 0) {
				state.opened.splice(index, 1);
			}
		},
		toggleCriterion() {}
	},
	selectors: {
		selectIsCriterionOpen(state, id) {
			return state.opened.includes(id);
		}
	}
});

const {actions, reducer, selectors} = criteriaSlice;
export const {openCriterion, closeCriterion, toggleCriterion} = actions;
export const {selectIsCriterionOpen} = selectors;
export default reducer;
