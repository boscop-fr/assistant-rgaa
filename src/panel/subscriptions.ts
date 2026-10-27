import {onOptionChange} from '../options/utils/storage';
import {switchReferenceVersion} from './slices/app';
import {storeState} from './slices/storage';
import type {createStore} from './store';

// Dispatches actions on browser events. Reactions to
// actions are handled by listeners instead (see
// `middlewares/listener.ts`).
export const subscribeToBrowserEvents = (
	store: ReturnType<typeof createStore>
) => {
	// Saves the state whenever the panel is hidden or closed.
	window.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			store.dispatch(storeState());
		}
	});

	onOptionChange<'referenceVersion'>('referenceVersion', (version) => {
		store.dispatch(switchReferenceVersion(version));
	});
};
