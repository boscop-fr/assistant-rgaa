import type {Effect, HelperOptions} from '../types';

export default ({style}: HelperOptions<'style'>): Effect =>
	() => {
		const tag = document.createElement('style');
		tag.textContent = style;
		document.head.insertAdjacentElement('beforeend', tag);

		return () => {
			tag.remove();
		};
	};
