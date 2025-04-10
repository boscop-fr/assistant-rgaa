import browser from 'webextension-polyfill';
import {captureCurrentTab} from '../../background/slices/runtime';
import {rgbToHex} from '../../common/utils/color';

const imageElement = async (base64: string) => {
	const {promise, resolve} = Promise.withResolvers<HTMLImageElement>();
	const image = new Image();
	image.onload = () => {
		resolve(image);
	};

	image.src = base64;
	return promise;
};

const imageCanvas = (image: HTMLImageElement) => {
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext('2d').drawImage(image, 0, 0);

	return canvas;
};

export const captureCurrentTabPixel = async (x: number, y: number) => {
	const base64 = (await browser.runtime.sendMessage(
		captureCurrentTab()
	)) as string;

	const image = await imageElement(base64);
	const [r, g, b] = imageCanvas(image)
		.getContext('2d')
		.getImageData(x, y, 1, 1, {colorSpace: 'srgb'}).data;

	return rgbToHex(r, g, b);
};
