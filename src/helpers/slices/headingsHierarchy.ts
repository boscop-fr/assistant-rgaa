import {createAction} from '@reduxjs/toolkit';
import type {HeadingHierarchyNode} from '../utils/getHeadingsHierarchy';

export const getHierarchy = createAction<HeadingHierarchyNode[]>(
	'helpers/headingsHierarchy/get'
);
