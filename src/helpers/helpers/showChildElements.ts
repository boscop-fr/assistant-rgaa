import {setChildHighlightOptionsEffect} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	childrenSelector,
	showName,
	showEmpty,
	attributes,
	showMissingAttributes,
	showContent
}: HelperOptions<'showChildElements'>) =>
	setChildHighlightOptionsEffect(selector, childrenSelector, (options) => {
		options.showTag(showName);
		options.showIfEmpty(showEmpty);
		options.pushAttributes(attributes, showMissingAttributes);
		options.showContent(showContent);
	});
