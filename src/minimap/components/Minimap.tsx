import React, {useRef} from 'react';
import type {JSX} from 'react/jsx-runtime';
import MinimapPins from './MinimapPins';
import MinimapWindow from './MinimapWindow';

const Minimap = () => {
	const mapRef = useRef(null);

	const scrollToPosition = ({
		clientY
	}: JSX.TargetedEvent<HTMLElement, MouseEvent>) => {
		const {scrollHeight} = document.documentElement;
		const center = (clientY / mapRef.current.clientHeight) * scrollHeight;
		const top = Math.max(0, center - window.innerHeight / 2);

		window.scrollTo({
			top
		});
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents :
		<div ref={mapRef} className="Minimap" onClick={scrollToPosition}>
			<MinimapWindow />
			<MinimapPins />
		</div>
	);
};

export default Minimap;
