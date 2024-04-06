import {all, call, put, takeEvery} from 'redux-saga/effects';
import {resetChecklist} from '../slices/checklist';
import {setHelpers} from '../slices/helpers';
import {setInstructions} from '../slices/instructions';
import {setReferenceData, setVersion} from '../slices/reference';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {fetchReference, flattenReference} from '../utils/reference';

function* setReferenceVersionWorker({payload: version}) {
	const [reference, helpers, instructions] = yield all([
		call(fetchReference, version),
		call(fetchHelpers, version),
		call(fetchInstructions, version)
	]);

	const flattened = flattenReference(reference);

	yield put(resetChecklist());
	yield put(setReferenceData(flattened));
	yield put(setHelpers(helpers));
	yield put(setInstructions(instructions));
}

export function* watchSetReferenceVersion() {
	yield takeEvery(setVersion.type, setReferenceVersionWorker);
}
