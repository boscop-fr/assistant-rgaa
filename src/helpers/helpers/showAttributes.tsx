import React from 'react';
import {createHelper} from '../utils/createHelper';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import serializeAttributes from '../utils/serializeAttributes';
import showCodeNearElement from '../utils/showCodeNearElement';

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
		document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
			const html = serializeAttributes(element, attributes, showMissing);

			if (html) {
				showCodeNearElement(element, html, {
					className:
						'rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowAttributesHelper'
				});
			}
		});
	},
	revert() {
		hideHelperElement('.rgaaExt-ShowAttributesHelper');
	}
});
