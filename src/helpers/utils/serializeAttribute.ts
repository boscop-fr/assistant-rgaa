// Attributes that contain a list of ids.
const linkAttributes = ['for', 'aria-labelledby', 'aria-describedby'];

// Transforms the given id into a link if possible, otherwise just return the id
const linkId = (id: string) => {
	let elements: Element[];
	let error = false;

	try {
		elements = Array.from(document.querySelectorAll(`#${id}`));
	} catch (e) {
		error = true;
	}

	// return a simple text if we can't link to the given id
	if (error || elements.length === 0) {
		return `${id} (introuvable)`;
	}

	const count = elements.length;
	const countString = count !== 1 ? ` (${count} occurrences)` : '';

	return `<a class="rgaaExt-Attribute-link" href="#${id}">${id}${countString}</a>`;
};

// Makes a anchor to each of the linked ids.
const linkIds = (id: string) => id.split(/\s+/).flatMap(linkId).join(' ');

const serializeAttribute = (
	element: HTMLElement,
	name: string,
	showMissing: boolean
) => {
	const value = element.getAttribute(name);

	if (typeof value === 'string') {
		const linkedIds = linkAttributes.includes(name) ? linkIds(value) : value;

		return `<span class="rgaaExt-Attribute"><span class="rgaaExt-Attribute-name">${name}</span>="<span class="rgaaExt-Attribute-value">${linkedIds}</span>"</span>`;
	}

	if (showMissing) {
		return `<span class="rgaaExt-Attribute"><span class="rgaaExt-Attribute-missing">${name} <span class="rgaaExt-ScreenReaderOnly">absent</span></span></span>`;
	}

	return null;
};

export default serializeAttribute;
