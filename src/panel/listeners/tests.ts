import {AppStartListening} from '../middlewares/listener';
import {disableTest, enableTest, selectEnabledTestIds} from '../slices/tests';

export const addTestsListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: enableTest,
		effect({payload: id}, api) {
			// disables previously enabled tests
			const state = api.getState();
			const enabledIds = selectEnabledTestIds(state);

			enabledIds.forEach((otherId) => {
				if (otherId !== id) {
					api.dispatch(disableTest(otherId));
				}
			});
		}
	});
};
