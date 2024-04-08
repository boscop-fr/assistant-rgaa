import {createListenerMiddleware} from '@reduxjs/toolkit';
import {addCriteriaListeners} from '../slices/criteria';
import {addHelpersListeners} from '../slices/helpers';
import {addOptionsListener} from '../slices/options';
import {addPanelListeners} from '../slices/panel';
import {addReferenceListeners} from '../slices/reference';
import {addStylesListeners} from '../slices/styles';
import {addTestsListeners} from '../slices/tests';

const {startListening, middleware} = createListenerMiddleware();

addCriteriaListeners(startListening);
addHelpersListeners(startListening);
addOptionsListener(startListening);
addPanelListeners(startListening);
addReferenceListeners(startListening);
addStylesListeners(startListening);
addTestsListeners(startListening);

export default middleware;
