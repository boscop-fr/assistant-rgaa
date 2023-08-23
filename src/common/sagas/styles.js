import {call, put, select, takeEvery} from 'redux-saga/effects';
import {applyHelpers, revertHelpers} from '../actions/helpers';
import {APPLY, REVERT, TOGGLE} from '../actions/styles';
import {areStylesEnabled} from '../selectors/styles';

/**
 *
 */
function* applyHelpersSaga(enabled) {
	const effect = enabled ? revertHelpers : applyHelpers;
	yield put(effect('styles', [{helper: 'disableAllStyles'}]));
}

/**
 *
 */
function* toggleStylesSaga({payload: enabled}) {
	yield call(applyHelpersSaga, enabled);
}

/**
 *
 */
function* applyStylesSaga() {
	const enabled = yield select(areStylesEnabled);
	yield call(applyHelpersSaga, enabled);
}

/**
 *
 */
function* revertStylesSaga() {
	yield call(applyHelpersSaga, true);
}

/**
 *
 */
export function* watchToggleStyles() {
	yield takeEvery(TOGGLE, toggleStylesSaga);
}

/**
 *
 */
export function* watchApplyStyles() {
	yield takeEvery(APPLY, applyStylesSaga);
}

/**
 *
 */
export function* watchRevertStyles() {
	yield takeEvery(REVERT, revertStylesSaga);
}
