import {createSlice} from '@reduxjs/toolkit';
import {helpersReady} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/tabs';
import {pollEffect} from '../utils/listeners';
import {onRuntimeAction} from '../utils/runtime';
import {selectPageTabId} from './panel';
import {disableTest, enableTest, selectEnabledTestIds} from './tests';

const helpersSlice = createSlice({
	name: 'helpers',
	initialState: {
		helpers: {}
	},
	reducers: {
		setHelpers(state, {payload: helpers}) {
			state.helpers = helpers; // eslint-disable-line no-param-reassign
		},
		toggleHelpers() {}
	},
	selectors: {
		selectTestHasHelpers(state, id) {
			return !!state.helpers?.[id]?.length;
		},
		selectHelpersByTest(state, id) {
			return state.helpers?.[id] || [];
		}
	}
});

const {actions, reducer, selectors} = helpersSlice;
export const {setHelpers, toggleHelpers} = actions;
export const {selectTestHasHelpers, selectHelpersByTest} = selectors;

export const addHelpersListeners = (startListening) => {
	startListening({
		actionCreator: toggleHelpers,
		effect(action, api) {
			const tabId = selectPageTabId(api.getState());
			sendMessage(tabId, action);
		}
	});

	startListening({
		actionCreator: enableTest,
		effect({payload: id}, api) {
			const helpers = selectHelpersByTest(api.getState(), id);
			api.dispatch(toggleHelpers({id, helpers, enabled: true}));
		}
	});

	startListening({
		actionCreator: disableTest,
		effect({payload: id}, api) {
			const helpers = selectHelpersByTest(api.getState(), id);
			api.dispatch(toggleHelpers({id, helpers, enabled: false}));
		}
	});

	startListening({
		predicate: () => true,
		effect: pollEffect(
			onRuntimeAction.bind(null, helpersReady),
			(action, api) => {
				const ids = selectEnabledTestIds(api.getState());

				ids.forEach((id) => {
					const helpers = selectHelpersByTest(api.getState(), id);

					api.dispatch(
						toggleHelpers({
							id,
							helpers,
							enabled: true
						})
					);
				});
			}
		)
	});
};

export default reducer;
