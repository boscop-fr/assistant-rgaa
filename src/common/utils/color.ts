import colorString from 'color-string';
import {hex as wcagContrast} from 'wcag-contrast';

export const isValidColor = (color: string) =>
	colorString.get.rgb(color) !== null;

export const rgbToHex = (r: number, g: number, b: number) =>
	colorString.to.hex(r, g, b);

export const cssToHex = (color: string) => {
	const [r, g, b] = colorString.get.rgb(color);
	return rgbToHex(r, g, b);
};

export const contrastRatio = (a: string, b: string) => wcagContrast(a, b);
