import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type StylesState = {
	enabled: boolean;
};

const initialState: StylesState = {
	enabled: true
};

const stylesSlice = createSlice({
	name: 'styles',
	initialState,
	reducers: {
		toggleStyles(state, {payload: enabled}: PayloadAction<boolean>) {
			state.enabled = enabled; // eslint-disable-line no-param-reassign
		}
	},
	selectors: {
		selectAreStylesEnabled(state) {
			return state.enabled;
		}
	}
});

const {actions, reducer, selectors} = stylesSlice;
export const {toggleStyles} = actions;
export const {selectAreStylesEnabled} = selectors;
export default reducer;
