import {HTMLElementList} from './dom';

//	Attributes muting works by aliasing original attributes.
//	The API also maintains a custom attribute which holds the
//	name of all muted attributes on an element. This allows
//	for better discoverability (i.e. CSS selectors can be used
//	to target elements with muted attributes).
//
//	For example, here is a link, before and after muting its
//	href attribute:
//
//	<a href="example.org" />
//	<a data-rgaa-ext-muted-href="example.org" data-rgaa-ext-muted="href" />

const MutedAttribute = 'data-rgaa-ext-muted';

const attributeAlias = (attribute: string) => `${MutedAttribute}-${attribute}`;

export const mutedAttributeSelector = (attribute: string, base = '') => {
	const alias = attributeAlias(attribute);
	return `${base}[${alias}]`;
};

export const anyMutedAttributeSelector = (base = '') =>
	`${base}[${MutedAttribute}]`;

const renameAttribute = (element: HTMLElement, from: string, to: string) => {
	element.setAttribute(to, element.getAttribute(from));
	element.removeAttribute(from);
};

const getMutedAttributes = (element: HTMLElement) => {
	const list = element.getAttribute(MutedAttribute);
	return list ? list.split(',') : [];
};

const setMutedAttributes = (element: HTMLElement, list: string[]) => {
	if (list.length) {
		element.setAttribute(MutedAttribute, list.join(','));
	} else {
		element.removeAttribute(MutedAttribute);
	}
};

const updateMutedAttributes = (
	element: HTMLElement,
	update: (list: string[]) => string[]
) => {
	const list = getMutedAttributes(element);
	setMutedAttributes(element, update(list));
};

const muteAttributeOnElement = (element: HTMLElement, attribute: string) => {
	renameAttribute(element, attribute, attributeAlias(attribute));
	updateMutedAttributes(element, (muted) => muted.concat(attribute));
};

const restoreAttributeOnElement = (element: HTMLElement, attribute: string) => {
	renameAttribute(element, attributeAlias(attribute), attribute);
	updateMutedAttributes(element, (muted) =>
		muted.filter((attr) => attr !== attribute)
	);
};

export const muteAttribute = (elements: HTMLElementList, attribute: string) => {
	const selector = `[${attribute}]:not([class^="rgaaExt"])`;

	elements.forEach((element) => {
		if (element.matches(selector)) {
			muteAttributeOnElement(element, attribute);
		}
	});
};

export const restoreAttribute = (
	elements: HTMLElementList,
	attribute: string
) => {
	const alias = attributeAlias(attribute);
	const selector = `[${alias}]`;

	elements.forEach((element) => {
		if (element.matches(selector)) {
			restoreAttributeOnElement(element, attribute);
		}
	});
};

export const restoreAllAttributes = (elements: HTMLElementList) => {
	elements.forEach((element) => {
		getMutedAttributes(element).forEach((attribute) => {
			restoreAttributeOnElement(element, attribute);
		});
	});
};
