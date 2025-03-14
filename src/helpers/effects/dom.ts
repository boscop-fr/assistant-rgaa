import type {Effect} from '../types';
import {muteAttribute, restoreAttribute} from '../utils/muteAttributes';

// Toggles all style sheets in the page.
export const toggleStyleSheetsEffect =
	(toggle: boolean): Effect =>
	() => {
		const sheets = Array.from(document.styleSheets);

		for (const sheet of sheets) {
			sheet.disabled = !toggle;
		}

		return () => {
			for (const sheet of sheets) {
				sheet.disabled = toggle;
			}
		};
	};

export const toggleClassEffect =
	(element: HTMLElement, className: string): Effect =>
	() => {
		element.classList.add(className);

		return () => {
			element.classList.remove(className);
		};
	};

export const muteElementsAttributeEffect =
	(selector: string, attribute: string): Effect =>
	() => {
		const elements = document.querySelectorAll<HTMLElement>(selector);
		muteAttribute(elements, attribute);

		return () => {
			restoreAttribute(elements, attribute);
		};
	};
