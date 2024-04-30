import {getOption} from '../../options/utils/storage';
import {AppStartListening} from '../middlewares/listener';
import {autoToggleTest, toggleTest} from '../slices/tests';

export const addTestsListeners = (startListening: AppStartListening) => {
	startListening({
		actionCreator: autoToggleTest,
		async effect({payload}, api) {
			const {id, toggle} = payload;
			const isExclusive = !(await getOption('allowMultipleTests'));

			api.dispatch(toggleTest({id, isExclusive, toggle}));
		}
	});
};
