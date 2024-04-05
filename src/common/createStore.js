import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import helpers from './slices/helpers';
import checklist from './slices/checklist';
import criteria from './slices/criteria';
import instructions from './slices/instructions';
import panel from './slices/panel';
import reference from './slices/reference';
import styles from './slices/styles';
import tests from './slices/tests';
import themes from './slices/themes';

/**
 *
 */
export default function createStore(preloadedState) {
	const sagaMiddleware = createSagaMiddleware();
	const store = configureStore({
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(sagaMiddleware),
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

	if (rootSaga) {
		sagaMiddleware.run(rootSaga);
	}

	return store;
}
