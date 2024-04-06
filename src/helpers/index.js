import $ from 'jquery';
import {helpersReady, tabUnloaded} from '../background/slices/runtime';
import {sendMessage} from '../common/utils/runtime';
import {toggleHelpers as toggleHelpersAction} from '../panel/slices/helpers';
import {revertActiveHelpers, toggleHelpers} from './utils/helpers';

browser.runtime.onMessage.addListener((action) => {
	if (toggleHelpersAction.match(action)) {
		const {id, helpers, enabled} = action.payload;
		toggleHelpers(id, helpers, enabled);
	} else if (tabUnloaded.match(action)) {
		revertActiveHelpers();
	}
});

$(() => {
	// Allows the sidebar to re-apply the current set of
	// helpers, as the script isn't aware of them.
	// This is useful when the tab is reloaded and a test is
	// already enabled.
	sendMessage(helpersReady());
});
