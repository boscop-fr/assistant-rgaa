import $ from 'jquery';
import React from 'react';
import {type IntlShape} from 'react-intl';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeElement from '../utils/serializeElement';
import showCodeNearElement from '../utils/showCodeNearElement';

export const defaults = {
	selector: '',
	childrenSelector: '',
	// Children attributes to show.
	attributes: [] as string[],
	// Show the tag even if it is empty (i.e. it has neither
	// content nor attributes.
	showEmpty: false,
	showName: true,
	// Show requested attributes that are not set on the element.
	showMissingAttributes: false,
	showContent: false
};

export const describe = (
	intl: IntlShape,
	{
		selector,
		childrenSelector,
		attributes = [],
		showEmpty,
		showName,
		showMissingAttributes,
		showContent
	} = defaults
) =>
	intl.formatMessage(
		{
			id: 'Helper.showChildElements'
		},
		{
			selector: sanitize(selector),
			childrenSelector: sanitize(childrenSelector),
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

// Shows a DOM element.
export const apply = (
	id: string,
	{selector, childrenSelector, ...options} = defaults
) =>
	$(selector).each((i, element) => {
		const $element = $(element);

		$element.find(childrenSelector).each((j, child) => {
			const html = serializeElement($(child), options);

			if (html) {
				showCodeNearElement(
					$element,
					$('<code />', {
						class: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowChildElementsHelper`,
						html
					})
				);
			}
		});
	});

// Hides children of particular elements.
export const revert = (id: string) => hideHelperElement(`.${id}`);
