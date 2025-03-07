import type {AppStartListening} from '../middlewares/listener';
import {resetResults} from '../slices/audit';
import {setHelpers} from '../slices/helpers';
import {setInstructions} from '../slices/instructions';
import {setReferenceData, setVersion} from '../slices/reference';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {fetchReference, flattenReference} from '../utils/reference';

export const addReferenceListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: setVersion,
		async effect({payload: version}, api) {
			const [reference, helpers, instructions] = await Promise.all([
				fetchReference(version),
				fetchHelpers(version),
				fetchInstructions(version)
			]);

			const flattened = flattenReference(reference);

			api.dispatch(resetResults());
			api.dispatch(setReferenceData(flattened));
			api.dispatch(setHelpers(helpers));
			api.dispatch(setInstructions(instructions));
		}
	});
};
