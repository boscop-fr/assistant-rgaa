import {all} from 'redux-saga/effects';
import * as criteria from './criteria';
import * as helpers from './helpers';
import * as options from './options';
import * as panel from './panel';
import * as reference from './reference';
import * as styles from './styles';
import * as tests from './tests';

export default function* sagas() {
	yield all([
		helpers.watchToggle(),
		helpers.watchHelpersReady(),
		tests.watchEnable(),
		tests.watchDisable(),
		criteria.watchToggleCriterion(),
		panel.watchTogglePopup(),
		panel.watchAll(),
		reference.watchSetReferenceVersion(),
		styles.watchToggleStyles(),
		styles.watchHelpersReady(),
		options.watchOpen(),
		options.watchVersionChange()
	]);
}
