import $ from 'jquery';
import React from 'react';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import showTagApi from '../utils/showTag';

/**
 *	@var {string} selector - Selector.
 *	@var {bool} showTag
 */
export const defaults = {
	selector: '',
	showTag: false
};

/**
 *	Describes the helper.
 *
 *	@param {object} intl - Intl API.
 *	@param {object} options - Options.
 */
export const describe = (intl, {selector, showTag} = defaults) =>
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

/**
 *	Adds an outline to each element matched by the given selector.
 *
 *	@param {string} id - UUID.
 *	@param {object} options - Options.
 */
export const apply = (id, {selector, showTag} = defaults) => {
	$(selector).addClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');

	if (showTag) {
		$(selector).each((i, element) => {
			showTagApi(id, $(element));
		});
	}
};

/**
 *	Removes outlines that were previously disabled using apply().
 *
 *	@param {string} id - UUID.
 *	@param {object} options - Options.
 */
export const revert = (id, {selector} = defaults) => {
	$(selector).removeClass('rgaaExt-Helper--mappable rgaaExt-OutlineHelper');
	hideHelperElement(`.${id}`);
};
