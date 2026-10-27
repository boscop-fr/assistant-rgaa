import {createAction} from '@reduxjs/toolkit';
import type {Helper} from '../types';

// Messages sent by the panel to the page.
export const applyHelpers = createAction<Helper[]>('helpers/applyHelpers');
export const revertActiveHelpers = createAction('helpers/revertActiveHelpers');
