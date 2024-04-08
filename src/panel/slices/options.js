import {createAction} from '@reduxjs/toolkit';
import {OPTIONS, onOptionChange} from '../../options/utils/storage';
import {pollEffect} from '../utils/listeners';
import {setVersion} from './reference';

export const openOptionsPage = createAction('options/openOptionsPage');

export const addOptionsListener = (startListening) => {
	startListening({
		actionCreator: openOptionsPage,
		effect() {
			browser.runtime.openOptionsPage();
		}
	});

	startListening({
		predicate: () => true,
		effect: pollEffect(
			onOptionChange.bind(null, OPTIONS.referenceVersion),
			(version, api) => {
				api.dispatch(setVersion(version));
			}
		)
	});
};
