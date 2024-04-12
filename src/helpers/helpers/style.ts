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
	apply(id, {style}) {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<style id="${id}">${style}</style>`
		);
	},
	revert(id) {
		document.getElementById(id).remove();
	}
});
