import React from 'react';
import type {JSX} from 'react/jsx-runtime';
import MinimapPins from './MinimapPins';
import MinimapWindow from './MinimapWindow';

const Minimap = () => {
	const scrollToPosition = ({
		clientY,
		currentTarget
	}: JSX.TargetedEvent<HTMLElement, MouseEvent>) => {
		const {scrollHeight} = document.documentElement;
		const center = (clientY / currentTarget.clientHeight) * scrollHeight;
		const top = Math.max(0, center - window.innerHeight / 2);

		window.scrollTo({
			top
		});
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: mouse shortcut, keyboard users scroll the page itself.
		<div className="Minimap" onClick={scrollToPosition}>
			<MinimapWindow />
			<MinimapPins />
		</div>
	);
};

export default Minimap;
