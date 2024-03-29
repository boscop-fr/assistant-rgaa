import {APPLY, REVERT} from '../common/actions/helpers';
import {applyHelpers, revertHelpers} from './api/helpers';

browser.runtime.onMessage.addListener(({type, payload}) => {
	switch (type) {
		case APPLY:
			applyHelpers(payload.id, payload.helpers);
			break;

		case REVERT:
			revertHelpers(payload.id, payload.helpers);
			break;

		default:
			break;
	}
});
