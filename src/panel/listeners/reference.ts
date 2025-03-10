import type {AppStartListening} from '../middlewares/listener';
import {resetResults} from '../slices/audit';
import {setHelpers} from '../slices/helpers';
import {setInstructions} from '../slices/instructions';
import {selectVersion, setReferenceData, setVersion} from '../slices/reference';
import {fetchHelpers} from '../utils/helpers';
import {fetchInstructions} from '../utils/instructions';
import {fetchReference, flattenReference} from '../utils/reference';

export const addReferenceListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: setVersion,
		async effect({payload: version}, api) {
			const reference = await fetchReference(version);
			const currentVersion = selectVersion(api.getState());

			if (reference.version === currentVersion) {
				return;
			}

			const [helpers, instructions] = await Promise.all([
				fetchHelpers(version),
				fetchInstructions(version)
			]);

			api.dispatch(resetResults());
			api.dispatch(setReferenceData(flattenReference(reference)));
			api.dispatch(setHelpers(helpers));
			api.dispatch(setInstructions(instructions));
		}
	});
};
