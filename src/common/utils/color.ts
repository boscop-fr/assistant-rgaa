import Color from 'colorjs.io';

export const srgbToHex = (r: number, g: number, b: number) =>
	new Color('srgb', [r, g, b]).toString({
		format: 'hex'
	});

export const cssToHex = (color: string) =>
	new Color(color).toString({format: 'hex'});

export const contrast = (a: string, b: string) =>
	new Color(a).contrastWCAG21(new Color(b));
