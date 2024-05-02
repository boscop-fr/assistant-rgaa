import React from 'react';
import {setChildHighlightOptionsEffect} from '../effects/highlight';
import {createHelper} from '../utils/createHelper';
import {sanitize} from '../utils/selectors';

type ShowChildElementsOptions = {
	selector: string;
	childrenSelector: string;
	// Children attributes to show.
	attributes?: string[];
	// Show the tag even if it is empty (i.e. it has neither
	// content nor attributes.
	showEmpty?: boolean;
	showName?: boolean;
	// Show requested attributes that are not set on the element.
	showMissingAttributes?: boolean;
	showContent?: boolean;
};

export default createHelper({
	name: 'showChildElements',
	defaultOptions: {
		attributes: [],
		showEmpty: false,
		showName: true,
		showMissingAttributes: false,
		showContent: false
	} as ShowChildElementsOptions,
	describe(
		intl,
		{
			selector,
			childrenSelector,
			attributes,
			showEmpty,
			showName,
			showMissingAttributes,
			showContent
		}
	) {
		return intl.formatMessage(
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
	},
	apply({
		selector,
		childrenSelector,
		showName,
		showEmpty,
		attributes,
		showMissingAttributes,
		showContent
	}) {
		return setChildHighlightOptionsEffect(
			selector,
			childrenSelector,
			(options) => {
				options.showTag(showName);
				options.showIfEmpty(showEmpty);
				options.pushAttributes(attributes, showMissingAttributes);
				options.showContent(showContent);
			}
		);
	}
});
