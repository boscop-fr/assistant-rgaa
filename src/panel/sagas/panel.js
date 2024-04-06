import {call, select, takeEvery, throttle} from 'redux-saga/effects';
import {closePopup, openPopup} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/runtime';
import {setTabState} from '../../common/utils/tabs';
import {selectPageTabId, selectPopupTabId, togglePopup} from '../slices/panel';

function* togglePopupWorker() {
	const state = yield select();
	const tabId = yield select(selectPageTabId);
	const popupTabId = yield select(selectPopupTabId);

	yield call(setTabState, tabId, state);
	yield call(
		sendMessage,
		popupTabId ? closePopup({tabId, popupTabId}) : openPopup({tabId})
	);
}

function* saveStateSaga() {
	const tabId = yield select(selectPageTabId);
	const state = yield select();

	setTabState(tabId, state);
}

export function* watchTogglePopup() {
	yield takeEvery(togglePopup.type, togglePopupWorker);
}

export function* watchAll() {
	// saves the whole state each time something changes
	yield throttle(300, '*', saveStateSaga);
}
