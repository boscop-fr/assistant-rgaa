import {createAction} from '@reduxjs/toolkit';
import type {ColorContrastStyle} from '../helpers/colorContrast';

export const requestPixelColor = createAction(
	'helpers/colorContrast/requestPixelColor'
);

export const requestTextColor = createAction(
	'helpers/colorContrast/requestTextColor'
);

export const requestStyle = createAction('helpers/colorContrast/requestStyle');
export const updateColor = createAction<string>(
	'helpers/colorContrast/updateColor'
);

export const updateStyle = createAction<ColorContrastStyle>(
	'helpers/colorContrast/updateStyle'
);
