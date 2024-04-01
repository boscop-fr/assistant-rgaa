import React, {useEffect, useRef} from 'react';
import {useDebouncedEffect, useResizeEffect} from '../api/hooks';

const MinimapPins = ({helpers, minimumPinSize = 4}) => {
	const canvasRef = useRef(null);

	const scrollToPosition = ({clientY}) => {
		const {scrollHeight} = document.documentElement;
		const center = (clientY / canvasRef.current.clientHeight) * scrollHeight;
		const top = Math.max(0, center - window.innerHeight / 2);

		window.scrollTo({
			top
		});
	};

	const updatePins = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const style = getComputedStyle(canvas);

		canvas.width = canvas.parentElement.clientWidth;
		canvas.height = canvas.parentElement.clientHeight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		helpers.forEach((helper) => {
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
	};

	useResizeEffect(updatePins);
	useDebouncedEffect(updatePins, [helpers]);
	useEffect(updatePins, []);

	return (
		<canvas
			ref={canvasRef}
			className="Minimap-pins"
			onClick={scrollToPosition}
		/>
	);
};

export default MinimapPins;
