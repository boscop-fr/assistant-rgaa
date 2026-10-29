import React from 'react';
import {sanitize} from '../../helpers/utils/selectors';
import type {PanelHelper} from './index';

export default {
	describe(
		intl,
		{
			selector,
			childrenSelector,
			attributes = [],
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
	}
} satisfies PanelHelper<'showChildElements'>;
