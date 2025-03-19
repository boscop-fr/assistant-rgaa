import {
	anyMutedAttributeSelector,
	restoreAllAttributes
} from './muteAttributes';

// @see http://stackoverflow.com/a/30930653
const escapeHtml = (html: string) =>
	(
		document.createElement('div').appendChild(document.createTextNode(html))
			.parentNode as HTMLElement
	).innerHTML;

// Returns inner HTML of the given element, without reserved
// extension's elements.
const innerHtml = (element: HTMLElement) => {
	const copy = element.cloneNode(true) as HTMLElement;
	const ownElements = copy.querySelectorAll('[class*=rgaaExt]');

	for (const element of ownElements) {
		element.remove();
	}

	// The majority of SVG child nodes aren't relevant for an
	// audit, we're stripping all of them except `title` and
	// `desc`.
	if (copy.matches('svg')) {
		for (const element of Array.from(copy.children)) {
			if (element.matches('title, desc')) {
				for (const {name} of Array.from(element.attributes)) {
					element.removeAttribute(name);
				}
			} else {
				element.remove();
			}
		}
	}

	// restores muted attributees
	restoreAllAttributes(copy.querySelectorAll(anyMutedAttributeSelector()));

	return escapeHtml(copy.innerHTML);
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
