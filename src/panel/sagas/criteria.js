import {put, select, takeEvery} from 'redux-saga/effects';
import {
	closeCriterion,
	openCriterion,
	selectIsCriterionOpen,
	toggleCriterion
} from '../slices/criteria';

function* toggleCriterionWorker({payload: id}) {
	const isOpen = yield select(selectIsCriterionOpen, id);

	if (isOpen) {
		yield put(closeCriterion(id));
	} else {
		yield put(openCriterion(id));
	}
}

export function* watchToggleCriterion() {
	yield takeEvery(toggleCriterion.type, toggleCriterionWorker);
}
