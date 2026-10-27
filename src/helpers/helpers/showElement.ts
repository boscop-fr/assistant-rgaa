import {setHighlightOptionsEffect} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	showName,
	showEmpty,
	attributes,
	showMissingAttributes,
	showContent
}: HelperOptions<'showElement'>) =>
	setHighlightOptionsEffect(selector, (options) => {
		options.showTag(showName);
		options.showIfEmpty(showEmpty);
		options.pushAttributes(attributes, showMissingAttributes);
		options.showContent(showContent);
	});
