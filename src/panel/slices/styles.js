import {createSlice} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import {pollEffect} from '../utils/listeners';
import {onRuntimeAction} from '../utils/runtime';
import {toggleHelpers} from './helpers';

const stylesSlice = createSlice({
	name: 'styles',
	initialState: {
		enabled: true
	},
	reducers: {
		toggleStyles(state, {payload: enabled}) {
			state.enabled = enabled; // eslint-disable-line no-param-reassign
		}
	},
	selectors: {
		selectAreStylesEnabled(state) {
			return state.enabled;
		}
	}
});

const {actions, reducer, selectors} = stylesSlice;
export const {toggleStyles} = actions;
export const {selectAreStylesEnabled} = selectors;

export const addStylesListeners = (startListening) => {
	const applyHelpers = (enabled) =>
		toggleHelpers({
			id: 'styles',
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

export default reducer;
