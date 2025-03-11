import {
	type ListenerEffectAPI,
	type UnknownAction,
	isAnyOf
} from '@reduxjs/toolkit';
import {helpersReady, tabAction} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {
	applyHelpers,
	removeGlobalHelper,
	revertActiveHelpers,
	selectGlobalHelpers,
	selectHelpersByTests,
	setGlobalHelper
} from '../slices/helpers';
import {selectTargetTabId} from '../slices/panel';
import {selectEnabledTestIds, toggleTest} from '../slices/tests';
import type {AppDispatch, AppState} from '../store';
import {pollEffect} from '../utils/listeners';

export const addHelpersListeners = (startListening: AppStartListening) => {
	// Dispatches actions received from the background script
	// to the store.
	startListening({
		predicate: () => true,
		effect: pollEffect(
			browser.runtime.onMessage.addListener,
			(api, message) => {
				if (
					!tabAction.match(message) ||
					!helpersReady.match(message.payload.action)
				) {
					return;
				}

				const tabId = selectTargetTabId(api.getState());

				if (message.payload.tabId === tabId) {
					api.dispatch(message.payload.action);
				}
			}
		)
	});

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
						browser.tabs.sendMessage(
							selectTargetTabId(api.getState()),
							revertActiveHelpers()
						);
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
		effect: (
			action: UnknownAction,
			api: ListenerEffectAPI<AppState, AppDispatch>
		) => {
			const state = api.getState();
			const ids = selectEnabledTestIds(state);
			const helpers = selectHelpersByTests(state, ids);
			const globalHelpers = selectGlobalHelpers(state);
			const allHelpers = helpers.concat(globalHelpers);
			const tabId = selectTargetTabId(api.getState());

			try {
				browser.tabs.sendMessage(
					tabId,
					allHelpers.length
						? applyHelpers(allHelpers)
						: revertActiveHelpers()
				);
			} catch (e) {
				// Content scripts on the receiving end
				// might not be loaded yet.
			}
		}
	});
};
