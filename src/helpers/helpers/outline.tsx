import React from 'react';
import {createHelper} from '../utils/createHelper';
import hideHelperElement from '../utils/hideHelperElement';
import {sanitize} from '../utils/selectors';
import showCodeNearElement from '../utils/showCodeNearElement';

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
		document.querySelectorAll(selector).forEach((element) => {
			element.classList.add(
				'rgaaExt-Helper--mappable',
				'rgaaExt-OutlineHelper'
			);
		});

		if (showTag) {
			document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
				showCodeNearElement(element, `${element.tagName.toLowerCase()}`, {
					className: `rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-OutlineHelper-tag`
				});
			});
		}
	},
	revert({selector}) {
		document.querySelectorAll(selector).forEach((element) => {
			element.classList.remove(
				'rgaaExt-Helper--mappable',
				'rgaaExt-OutlineHelper'
			);
		});

		hideHelperElement('.rgaaExt-OutlineHelper-tag');
	}
});
