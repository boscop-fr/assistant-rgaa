import browser from 'webextension-polyfill';
import {onOptionChange} from '../../options/utils/storage';
import type {AppStartListening} from '../middlewares/listener';
import {loadReference, setLoading} from '../slices/app';
import {openOptionsPage} from '../slices/options';
import {loadState} from '../slices/storage';
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
			async (api, version) => {
				// Loading blocks the auto save, which would otherwise
				// overwrite the state stored for the new version
				// with an empty one.
				api.dispatch(setLoading(true));

				try {
					await api.dispatch(loadReference(version)).unwrap();
					await api.dispatch(loadState()).unwrap();
				} finally {
					api.dispatch(setLoading(false));
				}
			}
		)
	});
};
