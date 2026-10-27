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
import {debounceListener} from '../utils/listeners';
import {sendToTab} from '../utils/port';

export const addHelpersListeners = (startListening: AppStartListening) => {
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
