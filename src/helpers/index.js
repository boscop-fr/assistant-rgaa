import $ from 'jquery';
import {sendMessage} from '../common/api/runtime';
import {
	applyHelpers as applyHelpersAction,
	revertHelpers as revertHelpersAction
} from '../common/slices/helpers';
import {helpersReady} from '../common/slices/runtime';
import {applyHelpers, revertHelpers} from './api/helpers';

browser.runtime.onMessage.addListener((action) => {
	if (applyHelpersAction.match(action)) {
		applyHelpers(action.payload.id, action.payload.helpers);
	} else if (revertHelpersAction.match(action)) {
		revertHelpers(action.payload.id, action.payload.helpers);
	}
});

$(() => {
	// Allows the sidebar to re-apply the current set of
	// helpers, as the script isn't aware of them.
	// This is useful when the tab is reloaded and a test is
	// already enabled.
	sendMessage(helpersReady());
});
