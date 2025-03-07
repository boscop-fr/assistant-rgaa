import {type PayloadAction, createSlice} from '@reduxjs/toolkit';
import type {Criterion} from '../../common/types';

type CriteriaState = {
	opened: Criterion['id'][];
};

const initialState: CriteriaState = {
	opened: []
};

const criteriaSlice = createSlice({
	name: 'criteria',
	initialState,
	reducers: {
		openCriterion(state, {payload: id}: PayloadAction<Criterion['id']>) {
			state.opened.push(id);
		},
		closeCriterion(state, {payload: id}: PayloadAction<Criterion['id']>) {
			const index = state.opened.findIndex((openedId) => id === openedId);

			if (index >= 0) {
				state.opened.splice(index, 1);
			}
		},
		toggleCriterion(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			state,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			action: PayloadAction<Criterion['id']>
		) {}
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
