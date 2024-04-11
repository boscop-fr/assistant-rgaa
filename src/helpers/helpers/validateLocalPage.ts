import LocalPageValidator from '../components/LocalPageValidator';
import {createHelper} from '../utils/createHelper';

export default createHelper({
	name: 'validateLocalPage',
	defaultOptions: {},
	component: LocalPageValidator,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.validateLocalPage'
		});
	}
});
