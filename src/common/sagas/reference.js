import {all, call, put, takeEvery} from 'redux-saga/effects';
import {reset as resetChecklist} from '../actions/checklist';
import {setHelpers} from '../actions/helpers';
import {set as setInstructions} from '../actions/instructions';
import {SET_REFERENCE_VERSION, setData} from '../actions/reference';
import {getHelpers} from '../api/helpers';
import {fetchInstructions} from '../api/instructions';
import {flattenReference, getReference} from '../api/reference';

/**
 *
 */
function* setReferenceVersionWorker({payload: {version}}) {
	const [reference, helpers, instructions] = yield all([
		call(getReference, version),
		call(getHelpers, version),
		call(fetchInstructions, version)
	]);

	const flattened = flattenReference(reference);

	yield put(resetChecklist());
	yield put(setData(flattened));
	yield put(setHelpers(helpers));
	yield put(setInstructions(instructions));
}

/**
 *
 */
export function* watchSetReferenceVersion() {
	yield takeEvery(SET_REFERENCE_VERSION, setReferenceVersionWorker);
}
