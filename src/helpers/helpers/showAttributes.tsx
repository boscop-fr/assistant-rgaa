import React from 'react';
import {setHighlightOptionsEffect} from '../effects/highlight';
import {createHelper} from '../utils/createHelper';
import {sanitize} from '../utils/selectors';

type ShowAttributesOptions = {
	selector: string;
	attributes: string[];
	// Whether or not to show attributes that aren't set.
	showMissing?: boolean;
};

export default createHelper({
	name: 'showAttributes',
	defaultOptions: {
		attributes: [],
		showMissing: false
	} as ShowAttributesOptions,
	describe(intl, {selector, attributes, showMissing = false}) {
		return intl.formatMessage(
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
	},
	apply({selector, attributes, showMissing = false}) {
		return setHighlightOptionsEffect(selector, (highlights) => {
			highlights.pushAttributes(attributes, showMissing);
		});
	}
});
