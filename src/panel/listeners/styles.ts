import type {ListenerEffectAPI} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import type {AppStartListening} from '../middlewares/listener';
import {removeGlobalHelper, setGlobalHelper} from '../slices/helpers';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';
import type {AppDispatch, AppState} from '../store';

export const addStylesListeners = (startListening: AppStartListening) => {
	const toggleGlobalHelper = (
		api: ListenerEffectAPI<AppState, AppDispatch>,
		enabled: boolean
	) => {
		if (enabled) {
			api.dispatch(removeGlobalHelper('styles'));
		} else {
			api.dispatch(
				setGlobalHelper({
					id: 'styles',
					helper: {helper: 'disableAllStyles'}
				})
			);
		}
	};

	startListening({
		actionCreator: toggleStyles,
		effect({payload: enabled}, api) {
			toggleGlobalHelper(api, enabled);
		}
	});

	startListening({
		actionCreator: helpersReady,
		effect(action, api) {
			const enabled = selectAreStylesEnabled(api.getState());
			toggleGlobalHelper(api, enabled);
		}
	});
};
