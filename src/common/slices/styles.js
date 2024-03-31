import {createSlice} from '@reduxjs/toolkit';

const stylesSlice = createSlice({
	name: 'styles',
	initialState: {
		enabled: true
	},
	reducers: {
		applyStyles() {},
		revertStyles() {},
		toggleStyles(state, {payload: enabled}) {
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
export const {applyStyles, revertStyles, toggleStyles} = actions;
export const {selectAreStylesEnabled} = selectors;
export default reducer;
