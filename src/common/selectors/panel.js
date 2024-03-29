import {get} from 'lodash';

export const getPageTabId = (state) => get(state, 'panel.pageInfo.tabId', null);
export const getPageTitle = (state) => get(state, 'panel.pageInfo.title', null);
export const getPageUrl = (state) => get(state, 'panel.pageInfo.url', null);
export const getPopupTabId = (state) => get(state, 'panel.pageInfo.popupTabId');
