import React from 'react';
import {setHighlightOptionsEffect} from '../effects/highlight';
import {createHelper} from '../utils/createHelper';
import {sanitize} from '../utils/selectors';

type OutlineOptions = {
	selector: string;
	showTag?: boolean;
};

export default createHelper({
	name: 'outline',
	defaultOptions: {
		showTag: false
	} as OutlineOptions,
	describe(intl, {selector, showTag = false}) {
		return intl.formatMessage(
			{
				id: 'Helper.outline'
			},
			{
				showTag,
				selector: sanitize(selector),
				code: (chunks) => <code>{chunks}</code>
			}
		);
	},
	apply({selector, showTag = false}) {
		return setHighlightOptionsEffect(selector, (highlights) => {
			highlights.showOutline(true);
			highlights.showTag(showTag);
			highlights.showIfEmpty(true);
		});
	}
});
