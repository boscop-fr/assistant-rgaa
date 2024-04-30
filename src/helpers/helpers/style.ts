import {hashCode} from '../../common/utils/strings';
import {createHelper} from '../utils/createHelper';

type StyleOptions = {
	style: string;
	description?: string;
};

export default createHelper({
	name: 'style',
	defaultOptions: {} as StyleOptions,
	describe(intl, {description}) {
		return intl.formatMessage(
			{
				id: 'Helper.style'
			},
			{
				description,
				hasDescription: !!description
			}
		);
	},
	apply({style}) {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<style id="${hashCode(style)}">${style}</style>`
		);
	},
	revert({style}) {
		document.getElementById(hashCode(style)).remove();
	}
});
