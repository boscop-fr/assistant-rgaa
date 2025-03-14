import {type PayloadAction, createSlice} from '@reduxjs/toolkit';

type ThemesState = {
	scrollPosition: number;
};

const initialState: ThemesState = {
	scrollPosition: 0
};

const themesSlice = createSlice({
	name: 'themes',
	initialState,
	reducers: {
		saveScrollPosition(state, {payload: position}: PayloadAction<number>) {
			state.scrollPosition = position;
		}
	},
	selectors: {
		selectScrollPosition(state) {
			return state.scrollPosition;
		}
	}
});

const {actions, reducer, selectors} = themesSlice;
export const {saveScrollPosition} = actions;
export const {selectScrollPosition} = selectors;
export default reducer;
