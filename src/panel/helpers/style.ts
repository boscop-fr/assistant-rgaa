import type {PanelHelper} from './index';

export default {
	describe(intl, {description}) {
		return intl.formatMessage(
			{
				id: 'Helper.style'
			},
			{
				description,
				hasDescription: !!description
			}
		);
	}
} satisfies PanelHelper<'style'>;
