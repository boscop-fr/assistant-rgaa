import type {
	ListenerEffect,
	ListenerEffectAPI,
	UnknownAction
} from '@reduxjs/toolkit';
import type {AppDispatch, AppState} from '../store';

// Executes an effect each time a subscriber emits a new value.
export const pollEffect =
	<P extends unknown[]>(
		subscribe: (callback: (...params: P) => void) => void,
		effect: (
			api: ListenerEffectAPI<AppState, AppDispatch>,
			...values: P
		) => void
	): ListenerEffect<UnknownAction, AppState, AppDispatch> =>
	(action, api) => {
		// We want the effect to run only once and start a
		// background task.
		api.unsubscribe();
		api.fork(async () => {
			let {promise, resolve} = Promise.withResolvers<P>();

			subscribe((...args) => {
				resolve(args);
			});

			while (true) {
				const args = await promise;
				({promise, resolve} = Promise.withResolvers<P>());
				effect(api, ...args);
			}
		});
	};
