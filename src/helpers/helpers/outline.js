import React from 'react';
import $ from 'jquery';
import showTagApi from '../api/showTag';
import hideHelperElement from '../api/hideHelperElement';
import {sanitize} from '../api/selectors';

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
	$(selector).addClass('rgaaExt-Helper rgaaExt-OutlineHelper');

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
	$(selector).removeClass('rgaaExt-Helper rgaaExt-OutlineHelper');
	hideHelperElement(`.${id}`);
};
