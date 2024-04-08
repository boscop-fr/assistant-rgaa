import $ from 'jquery';
import {concat, without} from 'lodash/fp';

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

const renameAttribute = (element: JQuery, from: string, to: string) => {
	element.attr(to, element.attr(from));
	element.removeAttr(from);
};

const getMutedAttributes = (element: JQuery) => {
	const list = element.attr(MutedAttribute);
	return list ? list.split(',') : [];
};

const setMutedAttributes = (element: JQuery, list: string[]) => {
	if (list.length) {
		element.attr(MutedAttribute, list.join(','));
	} else {
		element.removeAttr(MutedAttribute);
	}
};

const updateMutedAttributes = (
	element: JQuery,
	update: (list: string[]) => string[]
) => {
	const list = getMutedAttributes(element);
	setMutedAttributes(element, update(list));
};

const muteAttributeOnElement = (element: JQuery, attribute: string) => {
	renameAttribute(element, attribute, attributeAlias(attribute));
	updateMutedAttributes(element, concat(attribute));
};

const restoreAttributeOnElement = (element: JQuery, attribute: string) => {
	renameAttribute(element, attributeAlias(attribute), attribute);
	updateMutedAttributes(element, without([attribute]));
};

export const muteAttribute = (elements: JQuery, attribute: string) => {
	const selector = `[${attribute}]:not([class^="rgaaExt"])`;

	elements.filter(selector).each((i, element) => {
		muteAttributeOnElement($(element), attribute);
	});
};

export const restoreAttribute = (elements: JQuery, attribute: string) => {
	const alias = attributeAlias(attribute);
	const selector = `[${alias}]`;

	elements.filter(selector).each((i, element) => {
		restoreAttributeOnElement($(element), attribute);
	});
};

export const restoreAllAttributes = (elements: JQuery) => {
	elements.each((i, el) => {
		const element = $(el);

		getMutedAttributes(element).forEach((attribute) => {
			restoreAttributeOnElement(element, attribute);
		});
	});
};
