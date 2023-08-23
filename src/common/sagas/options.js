import {call, takeEvery} from 'redux-saga/effects';
import {OPEN} from '../actions/options';

/**
 *
 */
function* openWorker() {
	yield call(browser.runtime.openOptionsPage);
}

/**
 *
 */
export function* watchOpen() {
	yield takeEvery(OPEN, openWorker);
}
