import {eventChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {onOptionChange, OPTIONS} from '../api/options';
import {setReferenceVersion} from '../actions/reference';
import {reset as resetImport} from '../actions/imports';
import {OPEN} from '../actions/options';

const optionChannel = (key) =>
	eventChannel((emit) => onOptionChange(key, emit));

function* openWorker() {
	yield call(browser.runtime.openOptionsPage);
}

export function* watchOpen() {
	yield takeEvery(OPEN, openWorker);
}

export function* watchVersionChange() {
	const versionChannel = yield call(optionChannel, OPTIONS.referenceVersion);

	while (true) {
		const version = yield take(versionChannel);

		yield put(resetImport());
		yield put(setReferenceVersion(version));
	}
}
