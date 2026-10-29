import {
	applyHelpers as applyHelpersAction,
	revertActiveHelpers as revertActiveHelpersAction
} from './slices/helpers';
import {applyHelpers, revertActiveHelpers} from './utils/helpers';
import {listenToPanel} from './utils/panel';

// The panel connects once this script is injected, and
// sends the helpers to apply on connection and whenever
// they change. Helpers are reverted when it disconnects,
// i.e. when it is closed.
listenToPanel((action) => {
	if (applyHelpersAction.match(action)) {
		applyHelpers(action.payload);
	} else if (revertActiveHelpersAction.match(action)) {
		revertActiveHelpers();
	}
}, revertActiveHelpers);
