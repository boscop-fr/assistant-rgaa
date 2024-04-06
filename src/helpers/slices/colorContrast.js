import {createAction} from '@reduxjs/toolkit';

export const requestPixelColor = createAction(
	'helpers/colorContrast/requestPixelColor'
);

export const requestTextColor = createAction(
	'helpers/colorContrast/requestTextColor'
);

export const requestStyle = createAction('helpers/colorContrast/requestStyle');
export const updateColor = createAction('helpers/colorContrast/updateColor');
export const updateStyle = createAction('helpers/colorContrast/updateStyle');
