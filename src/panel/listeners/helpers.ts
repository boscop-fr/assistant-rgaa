import {helpersReady} from '../../background/slices/runtime';
import {sendMessage} from '../../common/utils/tabs';
import {AppStartListening} from '../middlewares/listener';
import {selectHelpersByTest, toggleHelpers} from '../slices/helpers';
import {selectPageTabId} from '../slices/panel';
import {disableTest, enableTest, selectEnabledTestIds} from '../slices/tests';
import {pollEffect} from '../utils/listeners';
import {onRuntimeAction} from '../utils/runtime';

export const addHelpersListeners = (startListening: AppStartListening) => {
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
