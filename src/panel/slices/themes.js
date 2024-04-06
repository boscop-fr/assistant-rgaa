import {createSlice} from '@reduxjs/toolkit';

const themesSlice = createSlice({
	name: 'themes',
	initialState: {
		isMenuOpen: false,
		scrollPosition: 0
	},
	reducers: {
		toggleMenu(state, {payload: isOpen}) {
			state.isMenuOpen = isOpen; // eslint-disable-line no-param-reassign
		},
		saveScrollPosition(state, {payload: position}) {
			state.scrollPosition = position; // eslint-disable-line no-param-reassign
		}
	},
	selectors: {
		selectIsMenuOpen(state) {
			return state.isMenuOpen;
		},
		selectScrollPosition(state) {
			return state.scrollPosition;
		}
	}
});

const {actions, reducer, selectors} = themesSlice;
export const {toggleMenu, saveScrollPosition} = actions;
export const {selectIsMenuOpen, selectScrollPosition} = selectors;
export default reducer;
