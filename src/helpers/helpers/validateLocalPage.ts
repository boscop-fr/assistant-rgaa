import {noop} from 'lodash';
import {type IntlShape} from 'react-intl';
import LocalPageValidator from '../components/LocalPageValidator';

export const describe = (intl: IntlShape) =>
	intl.formatMessage({
		id: 'Helper.validateLocalPage'
	});

export const component = () => LocalPageValidator;

export const apply = noop;

export const revert = noop;
