import React from 'react';
import {createHelper} from '../utils/createHelper';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeElement from '../utils/serializeElement';
import showCodeNearElement from '../utils/showCodeNearElement';

type ShowElementOptions = {
	selector: string;
	attributes?: string[];
	// Show the tag even if it is empty (i.e. it has
	// neither content nor attributes.
	showEmpty?: boolean;
	showName?: boolean;
	// Show requested attributes that are not set on the
	// element.
	showMissingAttributes?: boolean;
	showContent?: boolean;
};

export default createHelper({
	name: 'showElement',
	defaultOptions: {
		attributes: [],
		showEmpty: false,
		showName: true,
		showMissingAttributes: false,
		showContent: false
	} as ShowElementOptions,
	describe(
		intl,
		{
			selector,
			attributes,
			showEmpty,
			showName,
			showMissingAttributes,
			showContent
		}
	) {
		return intl.formatMessage(
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
	},
	apply(id, {selector, ...options}) {
		document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
			const html = serializeElement(element, options);

			if (html) {
				showCodeNearElement(element, html, {
					className: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowElementHelper`
				});
			}
		});
	},
	revert(id) {
		hideHelperElement(`.${id}`);
	}
});
