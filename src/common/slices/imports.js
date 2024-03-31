import {createSelector, createSlice} from '@reduxjs/toolkit';
import {countBy, groupBy, isEmpty, map, mapValues, upperFirst} from 'lodash';
import {selectAllTestIds} from './reference';

const initialState = {
	config: {
		delimiter: ',',
		quoteChar: '"'
	},
	isPending: false,
	content: null,
	errors: [],
	testResults: {},
	criteriaResults: {}
};

const importsSlice = createSlice({
	name: 'imports',
	initialState,
	reducers: {
		setPending(state, {payload: isPending}) {
			state.isPending = isPending; // eslint-disable-line no-param-reassign
		},
		setContent(state, {payload: content}) {
			state.content = content; // eslint-disable-line no-param-reassign
			state.isPending = false; // eslint-disable-line no-param-reassign
			state.errors = []; // eslint-disable-line no-param-reassign
		},
		setErrors(state, {payload: errors}) {
			state.errors = errors; // eslint-disable-line no-param-reassign
			state.content = null; // eslint-disable-line no-param-reassign
		},
		setConfig(state, {payload}) {
			state.config[payload.key] = payload.value; // eslint-disable-line no-param-reassign
		},
		setTestsResults(state, {payload: results}) {
			state.testResults = results; // eslint-disable-line no-param-reassign
		},
		setCriteriaResults(state, {payload: results}) {
			state.criteriaResults = results; // eslint-disable-line no-param-reassign
		},
		applyImports() {},
		resetImports(state) {
			state = initialState; // eslint-disable-line no-param-reassign, no-unused-vars
		}
	},
	selectors: {
		selectIsValid(state) {
			return !!state.content && !state.errors.length;
		},
		selectIsActive(state) {
			return !isEmpty(state.testResults);
		},
		selectVersion(state) {
			return state.content?.[0]?.['Version référentiel'];
		},
		selectConfig(state) {
			return state.config;
		},
		selectIsPending(state) {
			return state.isPending;
		},
		selectContent(state) {
			return state.content;
		},
		selectErrors(state) {
			return state.errors;
		},
		selectAllTestResults(state) {
			return state.testResults;
		},
		selectTestResult(state, id) {
			return state.testResult?.[id] || '';
		},
		selectCriterionResults(state, id) {
			return state.criteriaResults?.[id];
		}
	}
});

const {actions, reducer, selectors} = importsSlice;
export const {
	setPending,
	setContent,
	setErrors,
	setConfig,
	setTestsResults,
	setCriteriaResults,
	applyImports,
	resetImports
} = actions;
export const {
	selectIsValid,
	selectIsActive,
	selectVersion,
	selectConfig,
	selectIsPending,
	selectContent,
	selectErrors,
	selectAllTestResults,
	selectTestResult,
	selectCriterionResults
} = selectors;

export const selectContentByCriterion = createSelector(
	selectContent,
	(content) =>
		mapValues(groupBy(content, 'Critère'), (tests) =>
			countBy(map(tests, (test) => test.Statut.toLowerCase()))
		)
);

export const selectContentByTest = createSelector(
	[selectContent, selectAllTestIds],
	(content, ids) => {
		const importResults = Object.entries(
			content.map(({Test, Statut}) => [Test, Statut])
		);

		return Object.fromEntries(
			ids
				.filter((id) => id in importResults)
				.map((id) => [id, importResults[id].toLowerCase()])
		);
	}
);

export const selectHumanReadableErrors = createSelector(
	selectErrors,
	(errors) => {
		errors.map(({message, row}) =>
			row ? `Ligne ${row} : ${message}.` : `${upperFirst(message)}.`
		);
	}
);

export default reducer;
