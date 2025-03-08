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
		return () => {
			const id = hashCode(style);
			const tag = document.createElement('style');
			tag.id = id;
			tag.innerText = style;
			document.head.insertAdjacentElement('beforeend', tag);

			return () => {
				document.getElementById(id).remove();
			};
		};
	}
});
