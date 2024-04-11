import ViewSource from '../components/ViewSource';
import {createHelper} from '../utils/createHelper';

export default createHelper({
	name: 'viewSource',
	defaultOptions: {},
	component: ViewSource,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.viewSource'
		});
	}
});
