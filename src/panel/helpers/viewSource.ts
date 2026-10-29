import ViewSource from './components/ViewSource';
import type {PanelHelper} from './index';

export default {
	component: ViewSource,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.viewSource'
		});
	}
} satisfies PanelHelper<'viewSource'>;
