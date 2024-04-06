import {map, without} from 'lodash';
import {all, put, select, takeEvery} from 'redux-saga/effects';
import {selectHelpersByTest, toggleHelpers} from '../slices/helpers';
import {disableTest, enableTest, selectEnabledTestIds} from '../slices/tests';

function* enableSaga({payload: id}) {
	// disables previously enabled tests
	const enabledIds = yield select(selectEnabledTestIds);
	const otherEnabled = without(enabledIds, id);
	yield all(map(otherEnabled, (otherId) => put(disableTest(otherId))));

	const helpers = yield select(selectHelpersByTest, id);
	yield put(toggleHelpers({id, helpers, enabled: true}));
}

function* disableSaga({payload: id}) {
	const helpers = yield select(selectHelpersByTest, id);
	yield put(toggleHelpers({id, helpers, enabled: false}));
}

export function* watchEnable() {
	yield takeEvery(enableTest.type, enableSaga);
}

export function* watchDisable() {
	yield takeEvery(disableTest.type, disableSaga);
}
