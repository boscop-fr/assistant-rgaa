import type {ComponentChild} from 'preact';
import React, {type ComponentType} from 'react';
import type {IntlShape} from 'react-intl';
import {
	type HelperName,
	type HelperOf,
	type HelperOptions,
	helperOptions
} from '../../helpers/types';
import colorContrast from './colorContrast';
import disableAllStyles from './disableAllStyles';
import externalTool from './externalTool';
import headingsHierarchy from './headingsHierarchy';
import outline from './outline';
import showAttributes from './showAttributes';
import showChildElements from './showChildElements';
import showElement from './showElement';
import style from './style';
import validateLocalPage from './validateLocalPage';
import viewSource from './viewSource';

// How the panel presents a helper: a description, and an
// optional widget.
export type PanelHelper<N extends HelperName> = {
	describe: (intl: IntlShape, options: HelperOptions<N>) => ComponentChild;
	component?: ComponentType<HelperOptions<N>>;
};

const helpers: {[N in HelperName]: PanelHelper<N>} = {
	colorContrast,
	disableAllStyles,
	externalTool,
	headingsHierarchy,
	outline,
	showAttributes,
	showChildElements,
	showElement,
	style,
	validateLocalPage,
	viewSource
};

export const describeHelper = <N extends HelperName>(
	intl: IntlShape,
	helper: HelperOf<N>
) => helpers[helper.helper].describe(intl, helperOptions(helper));

// Renders the widget of a helper, if it has one.
export const HelperWidget = <N extends HelperName>({
	helper
}: {
	helper: HelperOf<N>;
}) => {
	const Widget = helpers[helper.helper].component;
	return Widget ? <Widget {...helperOptions(helper)} /> : null;
};
