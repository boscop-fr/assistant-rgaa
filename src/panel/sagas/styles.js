import {call, put, select, take, takeEvery} from 'redux-saga/effects';
import {helpersReady} from '../../background/slices/runtime';
import {messageChannel} from '../../common/utils/runtime';
import {toggleHelpers} from '../slices/helpers';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';

function* applyHelpersSaga(enabled) {
	yield put(
		toggleHelpers({
			id: 'styles',
			helpers: [{helper: 'disableAllStyles'}],
			// This can be quite confusing…
			// We're using the **disableAllStyles** helper, so
			// we want it to do the opposite of what we ask for
			// (i.e. enabled styles = !disableAllStyles)
			enabled: !enabled
		})
	);
}

function* toggleStylesSaga({payload: enabled}) {
	yield call(applyHelpersSaga, enabled);
}

function* applyStylesSaga() {
	const enabled = yield select(selectAreStylesEnabled);
	yield call(applyHelpersSaga, enabled);
}

export function* watchToggleStyles() {
	yield takeEvery(toggleStyles.type, toggleStylesSaga);
}

export function* watchHelpersReady() {
	const readyChannel = yield call(messageChannel, helpersReady);

	while (true) {
		yield take(readyChannel);
		yield call(applyStylesSaga);
	}
}
