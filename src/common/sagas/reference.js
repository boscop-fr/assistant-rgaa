import {all, call, put, takeEvery} from 'redux-saga/effects';
import {getHelpers} from '../api/helpers';
import {fetchInstructions} from '../api/instructions';
import {flattenReference, getReference} from '../api/reference';
import {resetChecklist} from '../slices/checklist';
import {setReferenceData, setVersion} from '../slices/reference';
import {setHelpers} from '../slices/helpers';
import {setInstructions} from '../slices/instructions';

function* setReferenceVersionWorker({payload: version}) {
	const [reference, helpers, instructions] = yield all([
		call(getReference, version),
		call(getHelpers, version),
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
