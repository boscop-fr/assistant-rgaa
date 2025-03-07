import {
	type ListenerEffectAPI,
	type UnknownAction,
	isAnyOf
} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/tabs';
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
import {onRuntimeAction} from '../utils/runtime';

export const addHelpersListeners = (startListening: AppStartListening) => {
	const applyHelpersEffect = (
		action: UnknownAction,
		api: ListenerEffectAPI<AppState, AppDispatch>
	) => {
		const state = api.getState();
		const ids = selectEnabledTestIds(state);
		const helpers = selectHelpersByTests(state, ids);
		const globalHelpers = selectGlobalHelpers(state);
		const allHelpers = helpers.concat(globalHelpers);
		const tabId = selectPageTabId(api.getState());

		sendMessage(
			tabId,
			allHelpers.length ? applyHelpers(allHelpers) : revertActiveHelpers()
		);
	};

	startListening({
		matcher: isAnyOf(toggleTest, setGlobalHelper, removeGlobalHelper),
		effect: applyHelpersEffect
	});

	startListening({
		predicate: () => true,
		effect: pollEffect(
			onRuntimeAction.bind(null, helpersReady),
			applyHelpersEffect
		)
	});
};
