import {
	type PayloadAction,
	createSelector,
	createSlice
} from '@reduxjs/toolkit';
import type {AuditResults, Test, TestStatus} from '../../common/types';
import {aggregateStatuses} from '../utils/tests';
import {selectTestsByCriterion} from './reference';

type AuditState = {
	results: AuditResults;
};

const DEFAULT_STATUS: TestStatus = 'NT';
const initialState: AuditState = {
	results: {}
};

const auditSlice = createSlice({
	name: 'audit',
	initialState,
	reducers: {
		setTestStatus(
			state,
			{payload}: PayloadAction<{id: Test['id']; status: TestStatus}>
		) {
			state.results[payload.id] = {
				status: payload.status
			};
		},
		resetResults() {
			return initialState;
		}
	},
	selectors: {
		selectAllTestResults(state) {
			return state.results;
		},
		selectTestStatus(state, id: Test['id']) {
			return state.results?.[id]?.status || DEFAULT_STATUS;
		}
	}
});

const {actions, reducer, selectors} = auditSlice;
export const {setTestStatus, resetResults} = actions;
export const {selectAllTestResults, selectTestStatus} = selectors;

export const selectCriterionStatus = createSelector(
	[selectAllTestResults, selectTestsByCriterion],
	(results, tests) =>
		aggregateStatuses(
			tests.map(({id}) => results?.[id]?.status || DEFAULT_STATUS)
		)
);

export default reducer;
