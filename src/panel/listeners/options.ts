import {onOptionChange} from '../../options/utils/storage';
import type {AppStartListening} from '../middlewares/listener';
import {loadReference} from '../slices/app';
import {openOptionsPage} from '../slices/options';
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
		effect: pollEffect<[string]>(
			onOptionChange.bind(null, 'referenceVersion'),
			(api, version) => {
				api.dispatch(loadReference(version));
			}
		)
	});
};
