import {call, put, select, takeEvery} from 'redux-saga/effects';
import {applyHelpers, revertHelpers} from '../slices/helpers';
import {
	selectAreStylesEnabled,
	applyStyles,
	revertStyles,
	toggleStyles
} from '../slices/styles';

function* applyHelpersSaga(enabled) {
	const effect = enabled ? revertHelpers : applyHelpers;
	yield put(
		effect({
			id: 'styles',
			helpers: [{helper: 'disableAllStyles'}]
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

function* revertStylesSaga() {
	yield call(applyHelpersSaga, true);
}

export function* watchToggleStyles() {
	yield takeEvery(toggleStyles.type, toggleStylesSaga);
}

export function* watchApplyStyles() {
	yield takeEvery(applyStyles.type, applyStylesSaga);
}

export function* watchRevertStyles() {
	yield takeEvery(revertStyles.type, revertStylesSaga);
}
