import {SET_PAGE_INFO} from '../actions/panel';

/**
 *
 */
const initialState = {
	pageInfo: {}
};

/**
 *
 */
export default function panel(state = initialState, {type, payload}) {
	switch (type) {
		case SET_PAGE_INFO:
			return {
				...state,
				pageInfo: payload
			};

		default:
			return state;
	}
}
