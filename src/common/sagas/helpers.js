import {call, put, select, takeEvery} from 'redux-saga/effects';
import {sendMessage} from '../api/tabs';
import {
	applyAllHelpers,
	applyHelpers,
	revertAllHelpers,
	revertHelpers,
	selectHelpersByTest
} from '../slices/helpers';
import {selectPageTabId} from '../slices/panel';
import {selectEnabledTests} from '../slices/tests';

function* applySaga(action) {
	const tabId = yield select(selectPageTabId);
	yield call(sendMessage, tabId, action);
}

function* revertSaga(action) {
	const tabId = yield select(selectPageTabId);
	yield call(sendMessage, tabId, action);
}

function* applyAllSaga() {
	const enabledTests = yield select(selectEnabledTests);

	// eslint-disable-next-line no-restricted-syntax
	for (const test of enabledTests) {
		const helpers = yield select(selectHelpersByTest, test.id);
		yield put(
			applyHelpers({
				id: test.id,
				helpers
			})
		);
	}
}

function* revertAllSaga() {
	const enabledTests = yield select(selectEnabledTests);

	// eslint-disable-next-line no-restricted-syntax
	for (const test of enabledTests) {
		const helpers = yield select(selectHelpersByTest, test.id);
		yield put(
			revertHelpers({
				id: test.id,
				helpers
			})
		);
	}
}

export function* watchApply() {
	yield takeEvery(applyHelpers.type, applySaga);
}

export function* watchRevert() {
	yield takeEvery(revertHelpers.type, revertSaga);
}

export function* watchApplyAll() {
	yield takeEvery(applyAllHelpers.type, applyAllSaga);
}

export function* watchRevertAll() {
	yield takeEvery(revertAllHelpers.type, revertAllSaga);
}
