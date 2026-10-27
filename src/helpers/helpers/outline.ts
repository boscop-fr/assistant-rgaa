import type {Highlight} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({selector, showTag}: HelperOptions<'outline'>): Highlight => ({
	selector,
	outline: true,
	tag: showTag,
	ifEmpty: true
});
