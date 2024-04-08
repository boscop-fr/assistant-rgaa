import serializeAttribute from './serializeAttribute';

const serializeAttributes = (
	element: JQuery,
	attributes: string[],
	showMissing: boolean
) =>
	attributes
		.map((attribute) => serializeAttribute(element, attribute, showMissing))
		.filter((attribute) => !!attribute)
		.join(' ');

export default serializeAttributes;
