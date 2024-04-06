import $ from 'jquery';
import React from 'react';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeAttributes from '../utils/serializeAttributes';
import showCodeNearElement from '../utils/showCodeNearElement';

/**
 *	@var {string} selector - Selector.
 *	@var {array} attributes - Attribute list.
 *	@var {boolean} showMissing - Whether or not to show attributes
 *		that aren't set.
 */
export const defaults = {
	selector: '',
	attributes: [],
	showMissing: false
};

/**
 *	Describes the helper.
 *
 *	@param {object} intl - Intl API.
 *	@param {object} options - Options.
 */
export const describe = (
	intl,
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

/**
 *	Shows a box containing attributes' name and value on
 *	each element matched by the given selector.
 *
 *	@param {string} id - UUID.
 *	@param {object} options - Options.
 */
export const apply = (id, {selector, attributes, showMissing} = defaults) =>
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

/**
 *	Removes all boxes previously added using apply().
 *
 *	@param {string} id - UUID.
 *	@param {object} options - Options.
 */
export const revert = (id) => hideHelperElement(`.${id}`);
