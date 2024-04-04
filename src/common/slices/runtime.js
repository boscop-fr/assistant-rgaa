import {createAction} from '@reduxjs/toolkit';

/**
 *	Runtime message types.
 *	These are not redux action types, but runtime message types.
 */
export const openSidebar = createAction('runtime/openSidebar');
export const openPopup = createAction('runtime/openPopup');
export const closePopup = createAction('runtime/closePopup');
export const getPixel = createAction('runtime/getPixel');
export const validatePage = createAction('runtime/validatePage');
export const viewPageSource = createAction('runtime/viewPageSource');
export const createTab = createAction('runtime/createTab');
export const tabReloaded = createAction('runtime/tabReloaded');
export const tabUnloaded = createAction('runtime/tabUnloaded');
export const helpersReady = createAction('runtime/helpersReady');

export const INVALID_RESPONSE = 'runtime/INVALID_RESPONSE';
