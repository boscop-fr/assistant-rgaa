import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type ThemesState = {
	isMenuOpen: boolean;
	scrollPosition: number;
};

const initialState: ThemesState = {
	isMenuOpen: false,
	scrollPosition: 0
};

const themesSlice = createSlice({
	name: 'themes',
	initialState,
	reducers: {
		toggleMenu(state, {payload: isOpen}: PayloadAction<boolean>) {
			state.isMenuOpen = isOpen; // eslint-disable-line no-param-reassign
		},
		saveScrollPosition(state, {payload: position}: PayloadAction<number>) {
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
