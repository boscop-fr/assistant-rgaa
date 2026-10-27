import {
	type ListenerEffectAPI,
	type UnknownAction,
	isAnyOf
} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {
	applyHelpers,
	removeGlobalHelper,
	revertActiveHelpers,
	selectGlobalHelpers,
	selectHelpersByTests,
	setGlobalHelper
} from '../slices/helpers';
import {selectEnabledTestIds, toggleTest} from '../slices/tests';
import type {AppDispatch, AppState} from '../store';
import {debounceListener, pollEffect} from '../utils/listeners';
import {sendToTab} from '../utils/port';

export const addHelpersListeners = (startListening: AppStartListening) => {
	startListening({
		predicate: () => true,
		effect: pollEffect(
			window.addEventListener.bind(null, 'visibilitychange'),
			(api) => {
				switch (document.visibilityState) {
					// Reverts helpers when the panel is closed or
					// hidden. We're relying on this because there
					// no event to tell when the panel is open or
					// closed. This requires more work as helpers
					// are applied or reverted each time the user
					// switches tab, but it is the only reliable
					// method.
					case 'hidden':
						sendToTab(revertActiveHelpers());
						break;

					// Reapplies helpers when the panel becomes
					// visible again.
					case 'visible':
						api.dispatch(helpersReady());
						break;
				}
			}
		)
	});

	startListening({
		matcher: isAnyOf(
			helpersReady,
			toggleTest,
			setGlobalHelper,
			removeGlobalHelper
		),
		effect: async (
			action: UnknownAction,
			api: ListenerEffectAPI<AppState, AppDispatch>
		) => {
			await debounceListener(api, 50);

			const state = api.getState();
			const ids = selectEnabledTestIds(state);
			const helpers = selectHelpersByTests(state, ids);
			const globalHelpers = selectGlobalHelpers(state);
			const allHelpers = helpers.concat(globalHelpers);

			sendToTab(
				allHelpers.length ? applyHelpers(allHelpers) : revertActiveHelpers()
			);
		}
	});
};
