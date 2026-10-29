import ColorContrast from './components/ColorContrast';
import type {PanelHelper} from './index';

export default {
	component: ColorContrast,
	describe(intl) {
		return intl.formatMessage({
			id: 'Helper.colorContrast'
		});
	}
} satisfies PanelHelper<'colorContrast'>;
