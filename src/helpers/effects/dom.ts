import type {Effect} from '../types';
import {muteAttribute, restoreAttribute} from '../utils/muteAttributes';

// Toggles all style sheets in the page.
export const toggleStyleSheetsEffect =
	(toggle: boolean): Effect =>
	() => {
		// Some sheets might already be disabled by the page (i.e.
		// alternate style sheets), so their state is restored
		// rather than toggled back.
		const sheets = Array.from(document.styleSheets).map((sheet) => ({
			sheet,
			disabled: sheet.disabled
		}));

		for (const {sheet} of sheets) {
			sheet.disabled = !toggle;
		}

		return () => {
			for (const {sheet, disabled} of sheets) {
				sheet.disabled = disabled;
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
