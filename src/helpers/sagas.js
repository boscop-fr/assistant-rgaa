import {all} from 'redux-saga/effects';
import * as helpers from '../common/sagas/helpers';
import * as panel from '../common/sagas/panel';

/**
 *
 */
export default function* sagas() {
	yield all([
		helpers.watchApply(),
		helpers.watchRevert(),
		helpers.watchApplyAll(),
		helpers.watchRevertAll(),
		panel.watchClose(),
		panel.watchOpen()
	]);
}
