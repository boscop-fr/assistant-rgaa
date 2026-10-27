import {captureCurrentTab} from '../../background/slices/runtime';
import {rgbToHex} from '../../common/utils/color';
import {browser} from '../../common/utils/webExtension';

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

	// The background answers nothing if the capture failed.
	if (!base64) {
		throw new Error('Could not capture the tab');
	}

	const image = await imageElement(base64);
	// The capture is in device pixels while coordinates are in
	// CSS pixels, which differ on HiDPI screens or when zoomed.
	const scale = image.width / window.innerWidth;
	const [r, g, b] = imageCanvas(image)
		.getContext('2d')
		.getImageData(x * scale, y * scale, 1, 1, {colorSpace: 'srgb'}).data;

	return rgbToHex(r, g, b);
};
