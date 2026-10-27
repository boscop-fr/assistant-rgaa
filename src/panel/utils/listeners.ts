import type {ListenerEffectAPI} from '@reduxjs/toolkit';
import type {AppDispatch, AppState} from '../store';

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#complex-async-workflows
export const debounceListener = async (
	api: ListenerEffectAPI<AppState, AppDispatch>,
	delay: number
) => {
	api.cancelActiveListeners();
	await api.delay(delay);
};
