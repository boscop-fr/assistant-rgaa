import React, {useCallback, useEffect, useRef} from 'react';
import {useMutationObserver, useResizeEffect} from '../api/hooks';

// Tells if the given element is positionned relatively to
// the window or the page by searching over its offset parents.
const isWindowRelative = (element: HTMLElement) => {
	let parent = element.offsetParent as HTMLElement;

	while (parent) {
		// We're skipping our own positionned elements.
		if (parent?.className.includes('rgaaExt')) {
			continue;
		}

		const style = getComputedStyle(parent);

		if (style.position === 'fixed' || style.position === 'sticky') {
			return true;
		}

		parent = parent.offsetParent as HTMLElement;
	}

	return false;
};

type RelativeBounds = {
	offset: number;
	size: number;
};

const windowRelativeBounds = (element: HTMLElement): RelativeBounds => {
	const {innerHeight} = window;
	const {top, height} = element.getBoundingClientRect();
	return {
		offset: top / innerHeight,
		size: height / innerHeight
	};
};

const pageRelativeBounds = (element: HTMLElement): RelativeBounds => {
	const {scrollHeight} = document.documentElement;
	const {top, height} = element.getBoundingClientRect();
	return {
		offset: (top + window.scrollY) / scrollHeight,
		size: height / scrollHeight
	};
};

type MinimapPinsProps = {
	minimumPinSize?: number;
};

const MinimapPins = ({minimumPinSize = 4}: MinimapPinsProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const updatePins = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const style = getComputedStyle(canvas);
		const windowPinColor = style.getPropertyValue('--window-pin-color');
		const pagePinColor = style.getPropertyValue('--page-pin-color');

		canvas.width = canvas.parentElement.clientWidth;
		canvas.height = canvas.parentElement.clientHeight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const mappable =
			document.querySelectorAll<HTMLElement>('.rgaaExt-Mappable');

		for (const element of mappable) {
			const isWinRelative = isWindowRelative(element);
			const {offset, size} = isWinRelative
				? windowRelativeBounds(element)
				: pageRelativeBounds(element);

			ctx.fillStyle = isWinRelative ? windowPinColor : pagePinColor;
			ctx.fillRect(
				0,
				offset * canvas.height,
				canvas.width,
				Math.max(minimumPinSize, size * canvas.height)
			);
		}
	}, [minimumPinSize]);

	const frame = useCallback(() => {
		requestAnimationFrame(updatePins);
	}, [updatePins]);

	useMutationObserver(frame);
	useResizeEffect(frame);
	useEffect(frame, []);

	return <canvas ref={canvasRef} className="Minimap-pins" />;
};

export default MinimapPins;
