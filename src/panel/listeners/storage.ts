import type {AppStartListening} from '../middlewares/listener';
import {selectIsAutoSavePaused} from '../slices/app';
import {helpersReady} from '../slices/helpers';
import {
	hasStoredStateChanged,
	stateLoaded,
	storeState
} from '../slices/storage';
import {debounceListener} from '../utils/listeners';

export const addStorageListeners = (startListening: AppStartListening) => {
	// Saves the state whenever a stored part of it changes,
	// except when it was just loaded.
	startListening({
		predicate: (action, current, previous) =>
			!stateLoaded.match(action) && hasStoredStateChanged(current, previous),
		async effect(_action, api) {
			// Avoids overwriting the stored state before it
			// is loaded.
			if (selectIsAutoSavePaused(api.getState())) {
				return;
			}

			await debounceListener(api, 50);

			// It might have been paused in the meantime.
			if (!selectIsAutoSavePaused(api.getState())) {
				api.dispatch(storeState());
			}
		}
	});

	// Reloads helpers whenever the state is loaded.
	startListening({
		actionCreator: stateLoaded,
		effect(_action, api) {
			api.dispatch(helpersReady());
		}
	});
};
