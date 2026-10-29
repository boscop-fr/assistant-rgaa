import type {Effect} from '../types';
import serializeAttributes from '../utils/serializeAttributes';
import serializeElement from '../utils/serializeElement';
import {
	removeCodeNearElement,
	showCodeNearElement
} from '../utils/showCodeNearElement';

// What to show about elements.
export type HighlightDisplay = {
	outline?: boolean;
	tag?: boolean;
	// Show the tag even if it has neither content nor
	// attributes.
	ifEmpty?: boolean;
	content?: boolean;
	attributes?: string[];
	// Attributes shown even when they are not set.
	missingAttributes?: string[];
};

// What a helper shows about the elements matching a
// selector, or about their children matching
// `childrenSelector`, next to their parent.
export type Highlight = HighlightDisplay & {
	selector: string;
	childrenSelector?: string;
};

const union = (a: string[] = [], b: string[] = []) =>
	Array.from(new Set([...a, ...b]));

// Merges displays requested by several helpers for the same
// element, showing everything any of them asked for.
export const mergeDisplays = (
	a: HighlightDisplay,
	b: HighlightDisplay
): HighlightDisplay => ({
	outline: a.outline || b.outline,
	tag: a.tag || b.tag,
	ifEmpty: a.ifEmpty || b.ifEmpty,
	content: a.content || b.content,
	attributes: union(a.attributes, b.attributes),
	missingAttributes: union(a.missingAttributes, b.missingAttributes)
});

type ElementHighlight = {
	element: HTMLElement;
	// Element next to which info is shown.
	target: HTMLElement;
	display: HighlightDisplay;
};

const findElements = ({selector, childrenSelector}: Highlight) => {
	const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

	return childrenSelector
		? elements.flatMap((target) =>
				Array.from(
					target.querySelectorAll<HTMLElement>(childrenSelector),
					(element) => ({element, target})
				)
			)
		: elements.map((element) => ({element, target: element}));
};

// Finds highlighted elements, with one display per element
// and target.
const resolveHighlights = (highlights: Highlight[]) => {
	const byElement = new Map<HTMLElement, Map<HTMLElement, ElementHighlight>>();

	for (const highlight of highlights) {
		let elements: ReturnType<typeof findElements>;

		try {
			elements = findElements(highlight);
		} catch (e) {
			// Invalid selector.
			console.error(e);
			continue;
		}

		for (const {element, target} of elements) {
			let byTarget = byElement.get(element);

			if (!byTarget) {
				byTarget = new Map();
				byElement.set(element, byTarget);
			}
			const current = byTarget.get(target);

			byTarget.set(target, {
				element,
				target,
				display: current
					? mergeDisplays(current.display, highlight)
					: mergeDisplays({}, highlight)
			});
		}
	}

	return Array.from(byElement.values()).flatMap((byTarget) =>
		Array.from(byTarget.values())
	);
};

const applyHighlight = ({element, target, display}: ElementHighlight) => {
	const html = serializeElement(element, {
		showName: display.tag,
		showEmpty: display.ifEmpty,
		attributes: serializeAttributes(
			element,
			display.attributes,
			display.missingAttributes
		),
		showContent: display.content
	});

	if (html) {
		showCodeNearElement(target, html);
	}

	if (display.outline) {
		element.classList.add('rgaaExt-Mappable', 'rgaaExt-Highlight--outline');
	}
};

const revertHighlight = ({element, target, display}: ElementHighlight) => {
	removeCodeNearElement(target);

	if (display.outline) {
		element.classList.remove('rgaaExt-Mappable', 'rgaaExt-Highlight--outline');
	}
};

// Modifies the page to show info about highlighted
// elements.
export const highlightElementsEffect =
	(highlights: Highlight[]): Effect =>
	() => {
		const elementHighlights = resolveHighlights(highlights);
		elementHighlights.forEach(applyHighlight);

		return () => {
			elementHighlights.forEach(revertHighlight);
		};
	};
