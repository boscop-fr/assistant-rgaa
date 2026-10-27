import type {Highlight} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	showName,
	showEmpty,
	attributes,
	showMissingAttributes,
	showContent
}: HelperOptions<'showElement'>): Highlight => ({
	selector,
	tag: showName,
	ifEmpty: showEmpty,
	attributes,
	missingAttributes: showMissingAttributes ? attributes : [],
	content: showContent
});
