import type {AppStartListening} from '../middlewares/listener';
import {
	closeCriterion,
	openCriterion,
	selectIsCriterionOpen,
	toggleCriterion
} from '../slices/criteria';

export const addCriteriaListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: toggleCriterion,
		effect({payload: id}, api) {
			const isOpen = selectIsCriterionOpen(api.getState(), id);

			if (isOpen) {
				api.dispatch(closeCriterion(id));
			} else {
				api.dispatch(openCriterion(id));
			}
		}
	});
};
