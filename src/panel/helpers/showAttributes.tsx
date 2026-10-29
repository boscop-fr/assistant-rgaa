import React from 'react';
import {sanitize} from '../../helpers/utils/selectors';
import type {PanelHelper} from './index';

export default {
	describe(intl, {selector, attributes, showMissing}) {
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
	}
} satisfies PanelHelper<'showAttributes'>;
