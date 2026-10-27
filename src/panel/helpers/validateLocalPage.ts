import LocalPageValidator from './components/LocalPageValidator';
import type {PanelHelper} from './index';

export default {
	component: LocalPageValidator,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.validateLocalPage'
		});
	}
} satisfies PanelHelper<'validateLocalPage'>;
