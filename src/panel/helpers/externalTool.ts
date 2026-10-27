import ExternalTool from './components/ExternalTool';
import type {PanelHelper} from './index';

export default {
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
} satisfies PanelHelper<'externalTool'>;
