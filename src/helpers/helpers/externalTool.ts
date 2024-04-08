import {noop} from 'lodash';
import {type IntlShape} from 'react-intl';
import ExternalTool from '../components/ExternalTool';

export const defaults = {
	name: '',
	url: ''
};

export const describe = (intl: IntlShape, {name} = defaults) =>
	intl.formatMessage(
		{
			id: 'Helper.externalTool'
		},
		{
			name,
			hasName: !!name
		}
	);

export const component = () => ExternalTool;

export const apply = noop;

export const revert = noop;
