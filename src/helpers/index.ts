import {helpersReady} from '../background/slices/runtime';
import {
	applyHelpers as applyHelpersAction,
	revertActiveHelpers as revertActiveHelpersAction
} from '../panel/slices/helpers';
import {onDomLoaded} from './utils/dom';
import {applyHelpers, revertActiveHelpers} from './utils/helpers';

browser.runtime.onMessage.addListener((action: unknown) => {
	if (applyHelpersAction.match(action)) {
		applyHelpers(action.payload);
	} else if (revertActiveHelpersAction.match(action)) {
		revertActiveHelpers();
	}
});

onDomLoaded(() => {
	// Allows the sidebar to re-apply the current set of
	// helpers, as the script isn't aware of them.
	// This is useful when the tab is reloaded and a test is
	// already enabled.
	browser.runtime.sendMessage(helpersReady());
});
