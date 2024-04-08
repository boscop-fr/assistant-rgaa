import {createAction} from '@reduxjs/toolkit';

// Runtime message types.
// These are not used inside redux but through the extension
// messaging system.
export const openSidebar = createAction<{tabId: number}>('runtime/openSidebar');
export const openPopup = createAction<{tabId: number}>('runtime/openPopup');
export const closePopup = createAction<{tabId: number; popupTabId: number}>(
	'runtime/closePopup'
);
export const getPixel = createAction<{x: number; y: number}>(
	'runtime/getPixel'
);
export const validatePage = createAction<{url: string}>('runtime/validatePage');
export const viewPageSource = createAction<{url: string}>(
	'runtime/viewPageSource'
);
export const createTab = createAction<{url: string}>('runtime/createTab');
export const tabReloaded = createAction('runtime/tabReloaded');
export const tabUnloaded = createAction('runtime/tabUnloaded');
export const helpersReady = createAction('runtime/helpersReady');

export const INVALID_RESPONSE = 'runtime/INVALID_RESPONSE';
