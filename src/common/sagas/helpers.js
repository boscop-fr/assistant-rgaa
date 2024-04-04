import {call, put, select, take, takeEvery} from 'redux-saga/effects';
import {sendMessage} from '../api/tabs';
import {messageChannel} from '../api/runtime';
import {selectHelpersByTest, toggleHelpers} from '../slices/helpers';
import {selectPageTabId} from '../slices/panel';
import {selectEnabledTests} from '../slices/tests';
import {helpersReady} from '../slices/runtime';

function* toggleSaga(action) {
	const tabId = yield select(selectPageTabId);
	yield call(sendMessage, tabId, action);
}

function* applyHelpersSaga() {
	const enabledTests = yield select(selectEnabledTests);

	// eslint-disable-next-line no-restricted-syntax
	for (const test of enabledTests) {
		const helpers = yield select(selectHelpersByTest, test.id);
		yield put(
			toggleHelpers({
				id: test.id,
				helpers,
				enabled: true
			})
		);
	}
}

export function* watchToggle() {
	yield takeEvery(toggleHelpers.type, toggleSaga);
}

export function* watchHelpersReady() {
	const readyChannel = yield call(messageChannel, helpersReady);

	while (true) {
		yield take(readyChannel);
		yield call(applyHelpersSaga);
	}
}
