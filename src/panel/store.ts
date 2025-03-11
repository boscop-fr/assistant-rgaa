import {combineReducers, configureStore} from '@reduxjs/toolkit';
import listener from './middlewares/listener';
import app from './slices/app';
import audit from './slices/audit';
import criteria from './slices/criteria';
import helpers from './slices/helpers';
import instructions from './slices/instructions';
import panel from './slices/panel';
import reference from './slices/reference';
import {storable} from './slices/storage';
import styles from './slices/styles';
import tests from './slices/tests';
import themes from './slices/themes';

const reducer = combineReducers({
	app,
	audit,
	criteria,
	helpers,
	instructions,
	panel,
	reference,
	styles,
	tests,
	themes
});

export type AppState = ReturnType<typeof reducer>;

export const createStore = () =>
	configureStore({
		reducer: storable(reducer),
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(listener)
	});

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
