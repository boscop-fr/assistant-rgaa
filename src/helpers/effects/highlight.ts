import type {Effect} from '../types';
import serializeAttributes from '../utils/serializeAttributes';
import serializeElement from '../utils/serializeElement';
import {
	removeCodeNearElement,
	showCodeNearElement
} from '../utils/showCodeNearElement';
import {HighlightOptions} from './HighlightOptions';

const optionsByElement = new Map<HTMLElement, HighlightOptions>();

// @todo There is a potential issue if multiple options are
// stored on the same element with different target elements,
// as only the element is used as a key to store options.
const getElementHighlightOptions = (
	element: HTMLElement,
	targetElement = element
) => {
	if (!optionsByElement.has(element)) {
		optionsByElement.set(element, new HighlightOptions(element, targetElement));
	}

	return optionsByElement.get(element);
};

const applyHighlights = (options: HighlightOptions) => {
	const serializedAttributes = serializeAttributes(
		options.element,
		options.attributes,
		options.missingAttributes
	);

	const html = serializeElement(options.element, {
		showName: options.tag,
		showEmpty: options.ifEmpty,
		attributes: serializedAttributes,
		showContent: options.content
	});

	if (html) {
		showCodeNearElement(options.targetElement, html);
	}

	if (options.outline) {
		options.element.classList.add(
			'rgaaExt-Mappable',
			'rgaaExt-Highlight--outline'
		);
	}
};

const revertHighlights = (options: HighlightOptions) => {
	removeCodeNearElement(options.targetElement);

	if (options.outline) {
		options.element.classList.remove(
			'rgaaExt-Mappable',
			'rgaaExt-Highlight--outline'
		);
	}
};

export const setHighlightOptionsEffect =
	(
		selector: string,
		register: (highlights: HighlightOptions) => void
	): Effect =>
	() => {
		const elements = document.querySelectorAll<HTMLElement>(selector);

		for (const element of elements) {
			register(getElementHighlightOptions(element));
		}

		return () => {};
	};

export const setChildHighlightOptionsEffect =
	(
		selector: string,
		childrenSelector: string,
		register: (highlights: HighlightOptions) => void
	): Effect =>
	() => {
		const elements = document.querySelectorAll<HTMLElement>(selector);

		for (const element of elements) {
			const children = element.querySelectorAll<HTMLElement>(childrenSelector);

			for (const child of children) {
				register(getElementHighlightOptions(child, element));
			}
		}

		return () => {};
	};

// Actually modifies the page to show info based on options
// set via the above effects.
export const highlightElementsEffect = (): Effect => () => {
	optionsByElement.forEach(applyHighlights);

	return () => {
		optionsByElement.forEach(revertHighlights);
		optionsByElement.clear();
	};
};
