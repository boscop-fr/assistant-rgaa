import serializeAttribute from './serializeAttribute';

export default function serializeAttributes(element, attributes, showMissing) {
	return attributes
		.map((attribute) => serializeAttribute(element, attribute, showMissing))
		.filter((attribute) => !!attribute)
		.join(' ');
}
