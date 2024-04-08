import $ from 'jquery';
import React from 'react';
import {IntlShape} from 'react-intl';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeAttributes from '../utils/serializeAttributes';
import showCodeNearElement from '../utils/showCodeNearElement';

export const defaults = {
	selector: '',
	attributes: [] as string[],
	// Whether or not to show attributes that aren't set.
	showMissing: false
};

export const describe = (
	intl: IntlShape,
	{selector, attributes = [], showMissing} = defaults
) =>
	intl.formatMessage(
		{
			id: 'Helper.showAttributes'
		},
		{
			selector: sanitize(selector),
			attributes: intl.formatList(attributes),
			attributeCount: attributes.length,
			showMissing,
			code: (chunks) => <code>{chunks}</code>
		}
	);

// Shows a box containing attributes' name and value on
// each element matched by the given selector.
export const apply = (
	id: string,
	{selector, attributes, showMissing} = defaults
) =>
	$(selector).each((i, element) => {
		const $element = $(element);
		const html = serializeAttributes($element, attributes, showMissing);

		if (html) {
			showCodeNearElement(
				$element,
				$('<code />', {
					class: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowAttributesHelper`,
					html
				})
			);
		}
	});

// Removes all boxes previously added using apply().
export const revert = (id: string) => hideHelperElement(`.${id}`);
