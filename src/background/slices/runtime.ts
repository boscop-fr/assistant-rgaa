import {createAction, isAnyOf} from '@reduxjs/toolkit';
import {AuditResults} from '../../common/types';

// Runtime message types.
// These are not used inside redux but through the extension
// messaging system.
export const openSidebar = createAction<{tabId: number}>('runtime/openSidebar');
export const openPopup = createAction<{tabId: number}>('runtime/openPopup');
export const closePopup = createAction<{tabId: number; popupTabId: number}>(
	'runtime/closePopup'
);

export const captureCurrentTab = createAction('runtime/captureCurrentTab');
export const validatePage = createAction<{url: string}>('runtime/validatePage');
export const viewPageSource = createAction<{url: string}>(
	'runtime/viewPageSource'
);
export const createTab = createAction<{url: string}>('runtime/createTab');
export const tabLoaded = createAction<{tabId: number}>('runtime/tabLoaded');
export const tabUnloaded = createAction('runtime/tabUnloaded');
export const helpersReady = createAction('runtime/helpersReady');

// For the following actions, the background script acts as
// a relay, receiving actions from a content script and
// broadcasting them to other ones, because content scripts
// can't communicate with each other directly.
export const isProxiedAction = isAnyOf(helpersReady);
