import {call, put, select, takeEvery} from 'redux-saga/effects';
import {router} from '../../panel/routes';
import {
	applyImports,
	selectContentByCriterion,
	selectContentByTest,
	selectVersion,
	setCriteriaResults,
	setTestsResults
} from '../slices/imports';
import {setVersion} from '../slices/reference';

function* applyWorker() {
	const importVersion = yield select(selectVersion);

	if (!importVersion) {
		return;
	}

	yield put(setVersion(importVersion));
	const testResults = yield select(selectContentByTest);
	const criteriaResults = yield select(selectContentByCriterion);
	yield put(setTestsResults(testResults));
	yield put(setCriteriaResults(criteriaResults));
	yield call(router.navigate, '/');
}

export function* watchApply() {
	yield takeEvery(applyImports.type, applyWorker);
}
