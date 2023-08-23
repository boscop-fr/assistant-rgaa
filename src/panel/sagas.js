import {all} from 'redux-saga/effects';
import * as panel from '../common/sagas/panel';
import * as imports from '../common/sagas/imports';
import * as tests from '../common/sagas/tests';
import * as criteria from '../common/sagas/criteria';
import * as styles from '../common/sagas/styles';

/**
 *
 */
export default function* sagas() {
	yield all([
		panel.watchSetPosition(),
		imports.watchApply(),
		tests.watchEnable(),
		tests.watchDisable(),
		criteria.watchToggleCriterion(),
		styles.watchToggleStyles(),
		styles.watchApplyStyles(),
		styles.watchRevertStyles()
	]);
}
