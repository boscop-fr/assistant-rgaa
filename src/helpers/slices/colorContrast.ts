import {createAction} from '@reduxjs/toolkit';

// Requests sent to the page, which answers with the picked
// color or style.
export const requestPixelColor = createAction(
	'helpers/colorContrast/requestPixelColor'
);

export const requestTextColor = createAction(
	'helpers/colorContrast/requestTextColor'
);

export const requestStyle = createAction('helpers/colorContrast/requestStyle');
