import {noop} from 'lodash';
import ViewSourceContainer from '../components/ViewSourceContainer';

/**
 *	Describes the helper.
 */
export const describe = (intl) =>
	intl.formatMessage({
		id: 'Helper.viewSource'
	});

/**
 *
 */
export const component = () => ViewSourceContainer;

/**
 *
 */
export const apply = noop;

/**
 *
 */
export const revert = noop;
