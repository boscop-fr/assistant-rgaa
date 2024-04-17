import type {
	ListenerEffect,
	ListenerEffectAPI,
	UnknownAction
} from '@reduxjs/toolkit';
import {AppDispatch, AppState} from '../store';

// Executes an effect each time a subscriber emits a new value.
export const pollEffect =
	<T>(
		subscribe: (callback: (value: T) => void) => void,
		effect: (value: T, api: ListenerEffectAPI<AppState, AppDispatch>) => void
	): ListenerEffect<UnknownAction, AppState, AppDispatch> =>
	(action, api) => {
		// We want the effect to run only once and start a
		// background task.
		api.unsubscribe();
		api.fork(async () => {
			let {promise, resolve} = Promise.withResolvers<T>();

			subscribe((value) => {
				resolve(value);
			});

			// eslint-disable-next-line no-constant-condition
			while (true) {
				// eslint-disable-next-line no-await-in-loop
				const value = await promise;
				({promise, resolve} = Promise.withResolvers<T>());
				effect(value, api);
			}
		});
	};
