import $ from 'jquery';
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
		$('head').append(
			$('<style />', {
				id,
				type: 'text/css',
				text: style
			})
		);
	},
	revert(id) {
		$(`#${id}`).remove();
	}
});
