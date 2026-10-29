import React, {useEffect, useRef} from 'react';
import {
	useAnimationFrame,
	useResizeEffect,
	useScrollEffect
} from '../api/hooks';

const MinimapWindow = () => {
	const windowRef = useRef<HTMLDivElement>(null);
	const updateWindow = useAnimationFrame(() => {
		const {scrollHeight} = document.documentElement;
		const {scrollY, innerHeight} = window;

		windowRef.current?.style.setProperty(
			'--window-offset-ratio',
			String(scrollY / scrollHeight)
		);

		windowRef.current?.style.setProperty(
			'--window-size-ratio',
			String(innerHeight / scrollHeight)
		);
	});

	useScrollEffect(updateWindow);
	useResizeEffect(updateWindow);
	useEffect(updateWindow, []);

	return <div ref={windowRef} className="Minimap-window" />;
};

export default MinimapWindow;
