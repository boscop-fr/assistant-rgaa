import {setHighlightOptionsEffect} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({selector, showTag = false}: HelperOptions<'outline'>) =>
	setHighlightOptionsEffect(selector, (highlights) => {
		highlights.showOutline(true);
		highlights.showTag(showTag);
		highlights.showIfEmpty(true);
	});
