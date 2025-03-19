import ExternalTool from '../components/ExternalTool';
import {createHelper} from '../utils/createHelper';

type ExternalToolOptions = {
	name: string;
	url: string;
};

export default createHelper({
	name: 'externalTool',
	defaultOptions: {} as ExternalToolOptions,
	component: ExternalTool,
	describe(intl, {name}) {
		return intl.formatMessage(
			{
				id: 'Helper.externalTool'
			},
			{
				name,
				hasName: !!name
			}
		);
	}
});
