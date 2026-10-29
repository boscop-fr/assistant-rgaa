import type {PanelHelper} from './index';

export default {
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.disableAllStyles'
		});
	}
} satisfies PanelHelper<'disableAllStyles'>;
