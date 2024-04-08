import React, {memo, useCallback, useEffect, useRef} from 'react';
import {useMutationObserver, useResizeEffect} from '../api/hooks';

type MinimapPinsProps = {
	minimumPinSize?: number;
};

const MinimapPins = memo(({minimumPinSize = 4}: MinimapPinsProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const updatePins = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const style = getComputedStyle(canvas);

		canvas.width = canvas.parentElement.clientWidth;
		canvas.height = canvas.parentElement.clientHeight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		document
			.querySelectorAll('.rgaaExt-Helper--mappable')
			.forEach((helper) => {
				const {scrollHeight} = document.documentElement;
				const {top, height} = helper.getBoundingClientRect();
				const relativeTop = (top + window.scrollY) / scrollHeight;
				const relativeHeight = height / scrollHeight;

				ctx.fillStyle = style.getPropertyValue('--pin-color');
				ctx.fillRect(
					0,
					relativeTop * canvas.height,
					canvas.width,
					Math.max(minimumPinSize, relativeHeight * canvas.height)
				);
			});
	}, [canvasRef]);

	const frame = useCallback(() => {
		requestAnimationFrame(updatePins);
	}, [updatePins]);

	useMutationObserver(frame);
	useResizeEffect(frame);
	useEffect(frame, []);

	return <canvas ref={canvasRef} className="Minimap-pins" />;
});

export default MinimapPins;
