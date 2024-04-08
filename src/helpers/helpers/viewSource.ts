import {noop} from 'lodash';
import {IntlShape} from 'react-intl';
import ViewSource from '../components/ViewSource';

export const describe = (intl: IntlShape) =>
	intl.formatMessage({
		id: 'Helper.viewSource'
	});

export const component = () => ViewSource;

export const apply = noop;

export const revert = noop;
