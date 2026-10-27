import React from 'react';
import {sanitize} from '../../helpers/utils/selectors';
import type {PanelHelper} from './index';

export default {
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
	}
} satisfies PanelHelper<'outline'>;
