import $ from 'jquery';
import React from 'react';
import {createHelper} from '../utils/createHelper';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import showTagApi from '../utils/showTag';

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
	apply(id, {selector, showTag = false}) {
		$(selector).addClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');

		if (showTag) {
			$(selector).each((i, element) => {
				showTagApi(id, $(element));
			});
		}
	},
	revert(id, {selector}) {
		$(selector).removeClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');
		hideHelperElement(`.${id}`);
	}
});
