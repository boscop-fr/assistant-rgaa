import {onOptionChange} from '../../options/utils/storage';
import {AppStartListening} from '../middlewares/listener';
import {openOptionsPage} from '../slices/options';
import {setVersion} from '../slices/reference';
import {pollEffect} from '../utils/listeners';

export const addOptionsListener = (startListening: AppStartListening) => {
	startListening({
		actionCreator: openOptionsPage,
		effect() {
			browser.runtime.openOptionsPage();
		}
	});

	startListening({
		predicate: () => true,
		effect: pollEffect<string>(
			onOptionChange.bind(null, 'referenceVersion'),
			(version, api) => {
				api.dispatch(setVersion(version));
			}
		)
	});
};
