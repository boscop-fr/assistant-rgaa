import {
	type PayloadAction,
	createSelector,
	createSlice
} from '@reduxjs/toolkit';
import type {
	ShallowCriterion,
	ShallowReference,
	ShallowTest,
	ShallowTheme
} from '../../common/types';

type ReferenceState = {
	reference?: ShallowReference;
	themes: Record<ShallowTheme['id'], ShallowTheme>;
	criteria: Record<ShallowCriterion['id'], ShallowCriterion>;
	tests: Record<ShallowTest['id'], ShallowTest>;
};

const initialState: ReferenceState = {
	reference: undefined,
	themes: {},
	criteria: {},
	tests: {}
};

const referenceSlice = createSlice({
	name: 'reference',
	initialState,
	reducers: {
		setReferenceData(state, {payload}: PayloadAction<ReferenceState>) {
			return payload;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		setVersion(state, {payload: version}: PayloadAction<string>) {}
	},
	selectors: {
		selectIsLoaded(state) {
			return !!state.reference?.version;
		},
		selectVersion(state) {
			return state.reference?.version;
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
			return state.criteria[id]?.references ?? {};
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

export const selectCriteriaByTheme = createSelector(
	[selectAllCriteria, (_, id) => id],
	(criteria, id) =>
		Object.values(criteria).filter(({themeId}) => themeId === id)
);

export const selectTestsByCriterion = createSelector(
	[selectAllTests, (_, id) => id],
	(tests, id) =>
		Object.values(tests).filter(({criterionId}) => criterionId === id)
);

export default reducer;
