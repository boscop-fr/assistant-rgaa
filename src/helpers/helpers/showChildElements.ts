import type {Highlight} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	childrenSelector,
	showName,
	showEmpty,
	attributes,
	showMissingAttributes,
	showContent
}: HelperOptions<'showChildElements'>): Highlight => ({
	selector,
	childrenSelector,
	tag: showName,
	ifEmpty: showEmpty,
	attributes,
	missingAttributes: showMissingAttributes ? attributes : [],
	content: showContent
});
