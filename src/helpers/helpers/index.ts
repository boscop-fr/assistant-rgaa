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
const effects: {
	[N in HelperName]?: (options: HelperOptions<N>) => Effect;
} = {
	colorContrast,
	disableAllStyles,
	headingsHierarchy,
	outline,
	showAttributes,
	showChildElements,
	showElement,
	style
};

export default effects;
