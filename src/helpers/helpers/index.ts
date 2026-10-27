import type {Highlight} from '../effects/highlight';
import type {Effect, HelperName, HelperOptions} from '../types';
import colorContrast from './colorContrast';
import disableAllStyles from './disableAllStyles';
import headingsHierarchy from './headingsHierarchy';
import outline from './outline';
import showAttributes from './showAttributes';
import showChildElements from './showChildElements';
import showElement from './showElement';
import style from './style';

// Effects of each helper on the page. Some helpers only
// provide a widget in the panel, and have no effect.
export const effects: {
	[N in HelperName]?: (options: HelperOptions<N>) => Effect;
} = {
	colorContrast,
	disableAllStyles,
	headingsHierarchy,
	style
};

// Info shown about elements by each helper. They are merged
// and rendered together, as several helpers can show info
// about the same element.
export const highlights: {
	[N in HelperName]?: (options: HelperOptions<N>) => Highlight;
} = {
	outline,
	showAttributes,
	showChildElements,
	showElement
};
