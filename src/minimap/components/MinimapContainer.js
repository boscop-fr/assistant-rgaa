import React, {useEffect, useRef} from 'react';
import root from 'react-shadow';
import styles from '../../../css/minimap/index.scss';
import Minimap from './Minimap';

// The minimap is rendered in a shadow DOM so the helpers
// don't pick up on its contents, and its subtree changes
// are not observable in the global scope.
const MinimapContainer = () => {
	const rootRef = useRef(null);

	return (
		<root.div
			ref={rootRef}
			style={{
				position: 'fixed',
				inset: '0 0 0 auto'
			}}
		>
			<Minimap />
			<style>{styles}</style>
		</root.div>
	);
};

export default MinimapContainer;
