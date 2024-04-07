import React, {useRef} from 'react';
import MinimapPins from './MinimapPins';
import MinimapWindow from './MinimapWindow';

const Minimap = () => {
	const mapRef = useRef(null);

	const scrollToPosition = ({clientY}) => {
		const {scrollHeight} = document.documentElement;
		const center = (clientY / mapRef.current.clientHeight) * scrollHeight;
		const top = Math.max(0, center - window.innerHeight / 2);

		window.scrollTo({
			top
		});
	};

	return (
		// eslint-disable-next-line max-len
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
		<div ref={mapRef} className="Minimap" onClick={scrollToPosition}>
			<MinimapWindow />
			<MinimapPins />
		</div>
	);
};

export default Minimap;
