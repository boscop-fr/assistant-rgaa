import {createSelector, createSlice} from '@reduxjs/toolkit';
import {filter} from 'lodash';

const referenceSlice = createSlice({
	name: 'reference',
	initialState: {
		reference: {},
		themes: {},
		criteria: {},
		tests: {}
	},
	reducers: {
		setReferenceData(state, {payload}) {
			state.reference = payload.reference; // eslint-disable-line no-param-reassign
			state.themes = payload.themes; // eslint-disable-line no-param-reassign
			state.criteria = payload.criteria; // eslint-disable-line no-param-reassign
			state.tests = payload.tests; // eslint-disable-line no-param-reassign
		},
		setVersion(state, {payload: version}) {} // eslint-disable-line no-unused-vars
	},
	selectors: {
		selectIsLoaded(state) {
			return !!state.reference?.version;
		},
		selectVersion(state) {
			return state.reference.version;
		},
		selectAllThemes(state) {
			return state.themes;
		},
		selectAllCriteria(state) {
			return state.criteria;
		},
		selectAllTests(state) {
			return state.tests;
		},
		selectReferenceLinksByCriterion(state, id) {
			return state.criteria[id]?.references ?? [];
		},
		selectSpecialCasesByCriterion(state, id) {
			return state.criteria[id]?.specialCases ?? null;
		},
		selectTechnicalNotesByCriterion(state, id) {
			return state.criteria[id]?.technicalNotes ?? null;
		}
	}
});

const {actions, reducer, selectors} = referenceSlice;
export const {setReferenceData, setVersion} = actions;
export const {
	selectIsLoaded,
	selectVersion,
	selectAllThemes,
	selectAllCriteria,
	selectAllTests,
	selectReferenceLinksByCriterion,
	selectSpecialCasesByCriterion,
	selectTechnicalNotesByCriterion
} = selectors;

export const selectAllTestIds = createSelector(selectAllTests, (tests) => {
	tests.map(({id}) => id);
});

export const selectCriteriaByTheme = createSelector(
	[selectAllCriteria, (_, id) => id],
	(criteria, id) => filter(criteria, ['themeId', id])
);

export const selectTestsByCriterion = createSelector(
	[selectAllTests, (_, id) => id],
	(tests, id) => filter(tests, ['criterionId', id])
);

export default reducer;
