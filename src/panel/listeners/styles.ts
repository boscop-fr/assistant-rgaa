import {helpersReady} from '../../background/slices/runtime';
import {AppStartListening} from '../middlewares/listener';
import {toggleHelpers} from '../slices/helpers';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';
import {pollEffect} from '../utils/listeners';
import {onRuntimeAction} from '../utils/runtime';

export const addStylesListeners = (startListening: AppStartListening) => {
	const applyHelpers = (enabled: boolean) =>
		toggleHelpers({
			id: 'internal.styles',
			helpers: [{helper: 'disableAllStyles'}],
			// This can be quite confusing…
			// We're using the **disableAllStyles** helper, so
			// we want it to do the opposite of what we ask for
			// (i.e. enabled styles = !disableAllStyles)
			enabled: !enabled
		});

	startListening({
		actionCreator: toggleStyles,
		effect({payload: enabled}, api) {
			api.dispatch(applyHelpers(enabled));
		}
	});

	startListening({
		predicate: () => true,
		effect: pollEffect(
			onRuntimeAction.bind(null, helpersReady),
			(action, api) => {
				const enabled = selectAreStylesEnabled(api.getState());
				api.dispatch(applyHelpers(enabled));
			}
		)
	});
};
