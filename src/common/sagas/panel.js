import {put, takeEvery} from 'redux-saga/effects';
import {sendMessage} from '../api/runtime';
import {OPEN_POPUP, CLOSE_POPUP} from '../actions/runtime';
import {applyAllHelpers, revertAllHelpers} from '../actions/helpers';
import {SET_POSITION, OPEN, CLOSE} from '../actions/panel';
import {Position} from '../api/panel';
import {applyStyles, revertStyles} from '../actions/styles';

/**
 *	Opens or closes a popup window depending on the dock position.
 */
// eslint-disable-next-line require-yield
export function* setPositionWorker({payload: position}) {
	sendMessage({
		type: position === Position.popup ? OPEN_POPUP : CLOSE_POPUP
	});
}

/**
 *
 */
export function* openWorker() {
	yield put(applyAllHelpers());
	yield put(applyStyles());
}

/**
 *
 */
export function* closeWorker() {
	yield put(revertAllHelpers());
	yield put(revertStyles());
}

/**
 *
 */
export function* watchSetPosition() {
	yield takeEvery(SET_POSITION, setPositionWorker);
}

/**
 *
 */
export function* watchOpen() {
	yield takeEvery(OPEN, openWorker);
}

/**
 *
 */
export function* watchClose() {
	yield takeEvery(CLOSE, closeWorker);
}
