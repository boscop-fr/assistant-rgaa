import type {Highlight} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	attributes,
	showMissing = false
}: HelperOptions<'showAttributes'>): Highlight => ({
	selector,
	attributes,
	missingAttributes: showMissing ? attributes : []
});
