import {createAction, isAnyOf} from '@reduxjs/toolkit';
import {type AuditResults} from '../../common/types';
import {
	requestPixelColor,
	requestStyle,
	requestTextColor
} from '../../helpers/slices/colorContrast';
import {getHierarchy} from '../../helpers/slices/headingsHierarchy';

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
export const panelUnloaded = createAction('runtime/panelUnloaded');
export const helpersReady = createAction('runtime/helpersReady');

// For the following actions, the background script acts as
// a relay, receiving actions from a content script and
// broadcasting them to different parts of the extension,
// because side panels and content scripts can't communicate
// with each other directly.
export const isRuntimeAction = isAnyOf(helpersReady);
export const isContentAction = isAnyOf(
	panelUnloaded,
	getHierarchy,
	requestPixelColor,
	requestTextColor,
	requestStyle
);
