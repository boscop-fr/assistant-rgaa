import $ from 'jquery';
import {type IntlShape} from 'react-intl';

export const describe = (intl: IntlShape, {description = ''} = {}) =>
	intl.formatMessage(
		{
			id: 'Helper.style'
		},
		{
			description,
			hasDescription: !!description
		}
	);

// Injects a custom style block in the <head />.
export const apply = (id: string, {style = ''} = {}) =>
	$('head').append(
		$('<style />', {
			id,
			type: 'text/css',
			text: style
		})
	);

// Removes style blocks previously added using apply().
export const revert = (id: string) => $(`#${id}`).remove();
