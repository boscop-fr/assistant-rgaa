import {combineReducers} from 'redux';
import panel from './panel';
import helpers from './helpers';
import reference from './reference';
import themes from './themes';
import criteria from './criteria';
import tests from './tests';
import instructions from './instructions';
import checklist from './checklist';
import imports from './imports';
import styles from './styles';

export const reducers = {
	reference,
	instructions,
	helpers,
	panel,
	themes,
	criteria,
	tests,
	checklist,
	imports,
	styles
};

export default combineReducers(reducers);
