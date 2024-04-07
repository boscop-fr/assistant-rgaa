import React, {memo, useEffect, useRef} from 'react';
import {useResizeEffect, useScrollEffect} from '../api/hooks';

const MinimapWindow = memo(() => {
	const windowRef = useRef(null);

	const updateWindow = () => {
		const {scrollHeight} = document.documentElement;
		const {scrollY, innerHeight} = window;

		windowRef.current.style.setProperty(
			'--window-offset-ratio',
			scrollY / scrollHeight
		);

		windowRef.current.style.setProperty(
			'--window-size-ratio',
			innerHeight / scrollHeight
		);
	};

	const frame = () => {
		requestAnimationFrame(updateWindow);
	};

	useScrollEffect(frame);
	useResizeEffect(frame);
	useEffect(frame, []);

	return <div ref={windowRef} className="Minimap-window" />;
});

export default MinimapWindow;
