import {eventChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {OPTIONS, onOptionChange} from '../../options/utils/storage';
import {openOptionsPage} from '../slices/options';
import {setVersion} from '../slices/reference';

const optionChannel = (key) =>
	eventChannel((emit) => onOptionChange(key, emit));

function* openWorker() {
	yield call(browser.runtime.openOptionsPage);
}

export function* watchOpen() {
	yield takeEvery(openOptionsPage.type, openWorker);
}

export function* watchVersionChange() {
	const versionChannel = yield call(optionChannel, OPTIONS.referenceVersion);

	while (true) {
		const version = yield take(versionChannel);
		yield put(setVersion(version));
	}
}
