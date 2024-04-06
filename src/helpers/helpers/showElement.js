import $ from 'jquery';
import React from 'react';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeElement from '../utils/serializeElement';
import showCodeNearElement from '../utils/showCodeNearElement';

/**
 *	@var {string} description - Tool description.
 *	@var {string} url - Tool URL.
 *	@var {string} selector - Selector.
 *	@var {array} attributes - Children attributes to show.
 *	@var {bool} showEmpty - Show the tag even if it is empty
 *		(i.e. it has neither content nor attributes.
 *	@var {bool} showName - Show tag name.
 *	@var {bool} showMissingAttributes - Show requested attributes
 *		that are not set on the element.
 *	@var {bool} showContent - Show text content.
 */
export const defaults = {
	selector: '',
	attributes: [],
	showEmpty: false,
	showName: true,
	showMissingAttributes: false,
	showContent: false
};

/**
 *	Describes the helper.
 *
 *	@param {object} intl - Intl API.
 *	@param {object} options - Options.
 */
export const describe = (
	intl,
	{
		selector,
		attributes = [],
		showEmpty,
		showName,
		showMissingAttributes,
		showContent
	} = defaults
) =>
	intl.formatMessage(
		{
			id: 'Helper.showElement'
		},
		{
			selector: sanitize(selector),
			attributes: intl.formatList(attributes),
			attributeCount: attributes.length,
			showEmpty,
			showName,
			showMissingAttributes,
			showContent,
			ul: (chunks) => <ul>{chunks}</ul>,
			li: (chunks) => <li>{chunks}</li>,
			code: (chunks) => <code>{chunks}</code>
		}
	);

/**
 *	Shows a DOM element.
 *
 *	@param {string} id - UUID.
 *	@param {object} options - Options.
 */
export const apply = (id, {selector, ...options} = defaults) =>
	$(selector).each((i, element) => {
		const $element = $(element);
		const html = serializeElement($element, options);

		if (html) {
			showCodeNearElement(
				$element,
				$('<code />', {
					class: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowElementHelper`,
					html
				})
			);
		}
	});

/**
 *	Hides children of particular elements.
 *
 *	@param {string} id - UUID.
 */
export const revert = (id) => hideHelperElement(`.${id}`);
