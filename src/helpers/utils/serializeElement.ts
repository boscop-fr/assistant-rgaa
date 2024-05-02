import {
	anyMutedAttributeSelector,
	restoreAllAttributes
} from './muteAttributes';

// @see http://stackoverflow.com/a/30930653
const escape = (html: string) =>
	(
		document.createElement('div').appendChild(document.createTextNode(html))
			.parentNode as HTMLElement
	).innerHTML;

// Returns inner HTML of the given element, without reserved
// extension's elements.
const innerHtml = (element: HTMLElement) => {
	const copy = element.cloneNode(true) as HTMLElement;

	// removes extension's elements
	copy.querySelectorAll('[class*=rgaaExt]').forEach((element) => {
		element.remove();
	});

	// The majority of SVG child nodes aren't relevant for an
	// audit, we're stripping all of them except `title` and
	// `desc`.
	if (copy.matches('svg')) {
		Array.from(copy.children).forEach((element) => {
			if (element.matches('title, desc')) {
				Array.from(element.attributes).forEach(({name}) => {
					element.removeAttribute(name);
				});
			} else {
				element.remove();
			}
		});
	}

	// restores muted attributees
	restoreAllAttributes(copy.querySelectorAll(anyMutedAttributeSelector()));

	return escape(copy.innerHTML);
};

const serializeElement = (
	element: HTMLElement,
	{
		attributes = '',
		showEmpty = false,
		showName = true,
		showContent = false
	} = {}
) => {
	const name = showName
		? `<span class="rgaaExt-Element-name">${element.nodeName.toLowerCase()}</span>`
		: '';

	const content = showContent
		? `<pre class="rgaaExt-Element-content">${innerHtml(element)}</pre>`
		: '';

	if (!showEmpty && !attributes && !content) {
		return '';
	}

	let html = `<span class="rgaaExt-Element">&lt;${name}`;

	if (attributes) {
		html += ` ${attributes}`;
	}

	if (content) {
		html += `&gt;${content}&lt;/${name}`;
	}

	return `${html}&gt;</span>`;
};

export default serializeElement;
