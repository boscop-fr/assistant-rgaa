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
			const tag = document.createElement('style');
			tag.textContent = style;
			document.head.insertAdjacentElement('beforeend', tag);

			return () => {
				tag.remove();
			};
		};
	}
});
