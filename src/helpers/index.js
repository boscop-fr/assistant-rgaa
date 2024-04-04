import $ from 'jquery';
import {sendMessage} from '../common/api/runtime';
import {toggleHelpers as toggleHelpersAction} from '../common/slices/helpers';
import {helpersReady, tabUnloaded} from '../common/slices/runtime';
import {revertActiveHelpers, toggleHelpers} from './api/helpers';

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
