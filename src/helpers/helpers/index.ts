import type {Highlight} from '../effects/highlight';
import type {
	Effect,
	HelperName,
	HelperNameOfKind,
	HelperOptions
} from '../types';
import colorContrast from './colorContrast';
import disableAllStyles from './disableAllStyles';
import headingsHierarchy from './headingsHierarchy';
import outline from './outline';
import showAttributes from './showAttributes';
import showChildElements from './showChildElements';
import showElement from './showElement';
import style from './style';

type Registry<N extends HelperName, T> = {
	[K in N]: (options: HelperOptions<K>) => T;
};

// Registries can be looked up by any helper name, and are
// checked to contain every helper of their kinds. Tools have
// no part in the page.
type Lookup<T> = Partial<Registry<HelperName, T>>;

// Effects of effect and service helpers, which are applied
// the same way.
export const effects: Lookup<Effect> = {
	colorContrast,
	disableAllStyles,
	headingsHierarchy,
	style
} satisfies Registry<HelperNameOfKind<'effect' | 'service'>, Effect>;

// Info shown about elements by each helper. They are merged
// and rendered together, as several helpers can show info
// about the same element.
export const highlights: Lookup<Highlight> = {
	outline,
	showAttributes,
	showChildElements,
	showElement
} satisfies Registry<HelperNameOfKind<'highlight'>, Highlight>;
