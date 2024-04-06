import {noop} from 'lodash';
import ViewSource from '../components/ViewSource';

/**
 *	Describes the helper.
 */
export const describe = (intl) =>
	intl.formatMessage({
		id: 'Helper.viewSource'
	});

export const component = () => ViewSource;

export const apply = noop;

export const revert = noop;
