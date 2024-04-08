import $ from 'jquery';
import React from 'react';
import {type IntlShape} from 'react-intl';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import showTagApi from '../utils/showTag';

export const defaults = {
	selector: '',
	showTag: false
};

export const describe = (intl: IntlShape, {selector, showTag} = defaults) =>
	intl.formatMessage(
		{
			id: 'Helper.outline'
		},
		{
			showTag,
			selector: sanitize(selector),
			code: (chunks) => <code>{chunks}</code>
		}
	);

// Adds an outline to each element matched by the given selector.
export const apply = (id: string, {selector, showTag} = defaults) => {
	$(selector).addClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');

	if (showTag) {
		$(selector).each((i, element) => {
			showTagApi(id, $(element));
		});
	}
};

// Removes outlines that were previously disabled using apply().
export const revert = (id: string, {selector} = defaults) => {
	$(selector).removeClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');
	hideHelperElement(`.${id}`);
};
