import {createAction} from '@reduxjs/toolkit';
import type {HeadingHierarchyNode} from '../utils/getHeadingsHierarchy';

export const getHierarchy = createAction('helpers/headingsHierarchy/get');
export const setHierarchy = createAction<HeadingHierarchyNode[]>(
	'helpers/headingsHierarchy/set'
);
