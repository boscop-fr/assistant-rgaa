import HeadingsHierarchy from './components/HeadingsHierarchy';
import type {PanelHelper} from './index';

export default {
	component: HeadingsHierarchy,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.headingsHierarchy'
		});
	}
} satisfies PanelHelper<'headingsHierarchy'>;
