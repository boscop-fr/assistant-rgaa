import React from 'react';
import MinimapWindow from './MinimapWindow';
import MinimapPins from './MinimapPins';
import {useHelperElements, useMutationObserver} from '../api/hooks';

const Minimap = () => {
	const [helpers, updateHelpers] = useHelperElements();

	useMutationObserver(updateHelpers);

	return (
		<div className="Minimap" data-helper-count={helpers.length}>
			<MinimapWindow />
			<MinimapPins helpers={helpers} />
		</div>
	);
};

export default Minimap;
