type Rgb = [number, number, number];

let context: CanvasRenderingContext2D;

// Lets the browser parse any CSS color, in any color space,
// down to sRGB. Like before, alpha is ignored (approximately
// for translucent colors, fully transparent ones are black).
const cssToRgb = (color: string): Rgb => {
	context ??= document
		.createElement('canvas')
		.getContext('2d', {willReadFrequently: true}) as CanvasRenderingContext2D;
	context.clearRect(0, 0, 1, 1);
	context.fillStyle = color;
	context.fillRect(0, 0, 1, 1);
	const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
	return [r, g, b];
};

export const isValidColor = (color: string) => CSS.supports('color', color);

export const rgbToHex = (r: number, g: number, b: number) =>
	`#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

export const cssToHex = (color: string) => rgbToHex(...cssToRgb(color));

// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
const relativeLuminance = (rgb: Rgb) => {
	const [r, g, b] = rgb.map((c) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
// NaN for invalid colors, which displays no ratio.
export const contrastRatio = (a: string, b: string) => {
	if (!isValidColor(a) || !isValidColor(b)) {
		return Number.NaN;
	}

	const [l1, l2] = [a, b]
		.map((color) => relativeLuminance(cssToRgb(color)))
		.sort((x, y) => y - x);

	return (l1 + 0.05) / (l2 + 0.05);
};
