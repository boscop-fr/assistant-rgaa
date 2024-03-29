/**
 *
 */
export const SET_PAGE_INFO = 'common/panel/SET_PAGE_INFO';
export const TOGGLE_POPUP = 'common/panel/TOGGLE_POPUP';

/**
 *
 */
export const setPageInfo = (data) => ({
	type: SET_PAGE_INFO,
	payload: data
});

export const togglePopup = () => ({
	type: TOGGLE_POPUP
});
