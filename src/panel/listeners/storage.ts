import type {Action} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {selectIsLoading} from '../slices/app';
import {stateLoaded, storeState} from '../slices/storage';
import {pollEffect} from '../utils/listeners';

export const addStorageListeners = (startListening: AppStartListening) => {
	const isStorageAction = ({type}: Action) => type.startsWith('storage/');

	// Saves the state whenever something happens.
	startListening({
		predicate: () => true,
		async effect(action, api) {
			// Avoids loops.
			if (isStorageAction(action)) {
				return;
			}

			// Avoids storing state until the app is fully
			// loaded, as it would overwrite any saved
			// state before it is even loaded.
			if (selectIsLoading(api.getState())) {
				return;
			}

			// Debounces the next dispatch.
			// @see https://redux-toolkit.js.org/api/createListenerMiddleware#complex-async-workflows
			api.cancelActiveListeners();
			await api.delay(50);

			api.dispatch(storeState());
		}
	});

	// Saves the state whenever the panel is hidden or closed.
	startListening({
		predicate: () => true,
		effect: pollEffect(
			window.addEventListener.bind(null, 'visibilitychange'),
			(api) => {
				if (document.visibilityState === 'hidden') {
					api.dispatch(storeState());
				}
			}
		)
	});

	// Reloads helpers whenever the state is loaded.
	startListening({
		actionCreator: stateLoaded,
		effect(action, api) {
			api.dispatch(helpersReady());
		}
	});
};
