import {setHighlightOptionsEffect} from '../effects/highlight';
import type {HelperOptions} from '../types';

export default ({
	selector,
	attributes,
	showMissing = false
}: HelperOptions<'showAttributes'>) =>
	setHighlightOptionsEffect(selector, (highlights) => {
		highlights.pushAttributes(attributes, showMissing);
	});
