import type {Effect} from '../types';
import {muteAttribute, restoreAttribute} from '../utils/muteAttributes';

// Toggles all style sheets in the page.
export const toggleStyleSheetsEffect =
	(toggle: boolean): Effect =>
	() => {
		const sheets = Array.from(document.styleSheets);

		sheets.forEach((sheet) => {
			// eslint-disable-next-line no-param-reassign
			sheet.disabled = !toggle;
		});

		return () => {
			sheets.forEach((sheet) => {
				// eslint-disable-next-line no-param-reassign
				sheet.disabled = toggle;
			});
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
