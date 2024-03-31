import {
	applyHelpers as applyHelpersAction,
	revertHelpers as revertHelpersAction
} from '../common/slices/helpers';
import {applyHelpers, revertHelpers} from './api/helpers';

browser.runtime.onMessage.addListener((action) => {
	if (applyHelpersAction.match(action)) {
		applyHelpers(action.payload.id, action.payload.helpers);
	} else if (revertHelpersAction.match(action)) {
		revertHelpers(action.payload.id, action.payload.helpers);
	}
});
