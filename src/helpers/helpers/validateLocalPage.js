import {noop} from 'lodash';
import LocalPageValidator from '../components/LocalPageValidator';

/**
 *	Describes the helper.
 */
export const describe = (intl) =>
	intl.formatMessage({
		id: 'Helper.validateLocalPage'
	});

export const component = () => LocalPageValidator;

export const apply = noop;

export const revert = noop;
