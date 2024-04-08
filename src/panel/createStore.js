import {configureStore} from '@reduxjs/toolkit';
import listenerMiddleware from './middlewares/listener';
import checklist from './slices/checklist';
import criteria from './slices/criteria';
import helpers from './slices/helpers';
import instructions from './slices/instructions';
import panel from './slices/panel';
import reference from './slices/reference';
import styles from './slices/styles';
import tests from './slices/tests';
import themes from './slices/themes';

export default function createStore(preloadedState) {
	const store = configureStore({
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(listenerMiddleware),
		reducer: {
			checklist,
			criteria,
			helpers,
			instructions,
			panel,
			reference,
			styles,
			tests,
			themes
		}
	});

	return store;
}
