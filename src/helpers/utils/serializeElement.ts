import {
	anyMutedAttributeSelector,
	restoreAllAttributes
} from './muteAttributes';
import serializeAttributes from './serializeAttributes';

// @see http://stackoverflow.com/a/30930653
const escape = (html: string) =>
	(
		document.createElement('div').appendChild(document.createTextNode(html))
			.parentNode as HTMLElement
	).innerHTML;

// Returns inner HTML of the given element, without reserved
// extension's elements.
const innerHtml = (element: JQuery) => {
	const copy = element.clone();

	// removes extension's elements
	copy.find('[class*=rgaaExt]').remove();

	// restores muted attributees
	restoreAllAttributes(copy.find(anyMutedAttributeSelector()));

	return escape(copy.html());
};

const serializeElement = (
	element: JQuery,
	{
		attributes = [] as string[],
		showEmpty = false,
		showName = true,
		showMissingAttributes = false,
		showContent = false
	} = {}
) => {
	const name = showName
		? `<span class="rgaaExt-Element-name">${element
				.get(0)
				.nodeName.toLowerCase()}</span>`
		: '';

	const serializedAttributes = serializeAttributes(
		element,
		attributes,
		showMissingAttributes
	);

	const content = showContent
		? `<pre class="rgaaExt-Element-content">${innerHtml(element)}</pre>`
		: '';

	if (!showEmpty && !serializedAttributes && !content) {
		return '';
	}

	let html = `<span class="rgaaExt-Element">&lt;${name}`;

	if (serializedAttributes) {
		html += ` ${serializedAttributes}`;
	}

	if (content) {
		html += `&gt;${content}&lt;/${name}`;
	}

	return `${html}&gt;</span>`;
};

export default serializeElement;
