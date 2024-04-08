import $ from 'jquery';
import React from 'react';
import {type IntlShape} from 'react-intl';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeElement from '../utils/serializeElement';
import showCodeNearElement from '../utils/showCodeNearElement';

export const defaults = {
	selector: '',
	attributes: [] as string[],
	showEmpty: false,
	showName: true,
	showMissingAttributes: false,
	showContent: false
};

export const describe = (
	intl: IntlShape,
	{
		selector,
		attributes = [],
		// Show the tag even if it is empty (i.e. it has
		// neither content nor attributes.
		showEmpty,
		showName,
		// Show requested attributes that are not set on the
		// element.
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

// Shows a DOM element.
export const apply = (id: string, {selector, ...options} = defaults) =>
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

// Hides children of particular elements.
export const revert = (id: string) => hideHelperElement(`.${id}`);
