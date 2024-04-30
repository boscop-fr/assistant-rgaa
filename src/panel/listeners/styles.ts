import {type ListenerEffectAPI} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import {AppStartListening} from '../middlewares/listener';
import {removeGlobalHelper, setGlobalHelper} from '../slices/helpers';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';
import {AppDispatch, AppState} from '../store';
import {pollEffect} from '../utils/listeners';
import {onRuntimeAction} from '../utils/runtime';

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
		predicate: () => true,
		effect: pollEffect(
			onRuntimeAction.bind(null, helpersReady),
			(action, api) => {
				const enabled = selectAreStylesEnabled(api.getState());
				toggleGlobalHelper(api, enabled);
			}
		)
	});
};
