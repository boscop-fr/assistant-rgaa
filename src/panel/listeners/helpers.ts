import {
	type ListenerEffectAPI,
	type UnknownAction,
	isAnyOf
} from '@reduxjs/toolkit';
import {
	helpersReady,
	syncHelpers,
	tabAction
} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {
	applyHelpers,
	removeGlobalHelper,
	revertActiveHelpers,
	selectGlobalHelpers,
	selectHelpersByTests,
	setGlobalHelper
} from '../slices/helpers';
import {selectPageTabId} from '../slices/panel';
import {selectEnabledTestIds, toggleTest} from '../slices/tests';
import type {AppDispatch, AppState} from '../store';
import {pollEffect} from '../utils/listeners';

export const addHelpersListeners = (startListening: AppStartListening) => {
	startListening({
		predicate: () => true,
		effect: pollEffect(
			browser.runtime.onMessage.addListener,
			(message, api) => {
				if (
					!tabAction.match(message) ||
					!helpersReady.match(message.payload.action)
				) {
					return;
				}

				const tabId = selectPageTabId(api.getState());

				if (message.payload.tabId === tabId) {
					api.dispatch(message.payload.action);
				}
			}
		)
	});

	startListening({
		matcher: isAnyOf(
			helpersReady,
			syncHelpers,
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
			const tabId = selectPageTabId(api.getState());

			browser.tabs.sendMessage(
				tabId,
				allHelpers.length ? applyHelpers(allHelpers) : revertActiveHelpers()
			);
		}
	});
};
