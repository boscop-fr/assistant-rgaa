import {createListenerMiddleware} from '@reduxjs/toolkit';
import {addCriteriaListeners} from '../listeners/criteria';
import {addHelpersListeners} from '../listeners/helpers';
import {addOptionsListener} from '../listeners/options';
import {addPanelListeners} from '../listeners/panel';
import {addReferenceListeners} from '../listeners/reference';
import {addStylesListeners} from '../listeners/styles';
import {addTestsListeners} from '../listeners/tests';
import {AppDispatch, AppState} from '../store';

const listener = createListenerMiddleware();
const startListening = listener.startListening.withTypes<
	AppState,
	AppDispatch
>();

export type AppStartListening = typeof startListening;

addCriteriaListeners(startListening);
addHelpersListeners(startListening);
addOptionsListener(startListening);
addPanelListeners(startListening);
addReferenceListeners(startListening);
addStylesListeners(startListening);
addTestsListeners(startListening);

export default listener.middleware;
