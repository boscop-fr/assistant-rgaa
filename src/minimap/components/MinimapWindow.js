import React, {useEffect, useState} from 'react';
import {useResizeEffect, useScrollEffect} from '../api/hooks';

const MinimapWindow = () => {
	const [offset, setOffset] = useState();
	const [size, setSize] = useState();

	const updateWindow = () => {
		const {scrollHeight} = document.documentElement;
		const {scrollY, innerHeight} = window;

		setOffset(scrollY / scrollHeight);
		setSize(innerHeight / scrollHeight);
	};

	useScrollEffect(updateWindow);
	useResizeEffect(updateWindow);
	useEffect(updateWindow, []);

	return (
		<div
			className="Minimap-window"
			style={{
				'--window-offset-ratio': offset,
				'--window-size-ratio': size
			}}
		/>
	);
};

export default MinimapWindow;
