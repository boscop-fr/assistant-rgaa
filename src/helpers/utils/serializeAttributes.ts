import serializeAttribute from './serializeAttribute';

const serializeAttributes = (
	element: HTMLElement,
	attributes: string[],
	shownWhenMissing: string[]
) =>
	attributes
		.map((attribute) =>
			serializeAttribute(
				element,
				attribute,
				shownWhenMissing.includes(attribute)
			)
		)
		.filter((attribute) => !!attribute)
		.join(' ');

export default serializeAttributes;
