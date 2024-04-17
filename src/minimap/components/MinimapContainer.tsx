import React from 'react';
import root from 'react-shadow';
import containerStyles from '../../../css/minimap/components/rgaaExt-MinimapContainer.css';
import styles from '../../../css/minimap/index.css';
import Minimap from './Minimap';

// The minimap is rendered in a shadow DOM so the helpers
// don't pick up on its contents, and its subtree changes
// are not observable in the global scope.
const MinimapContainer = () => {
	// We're not using the className for styling purposes but
	// to prevent helpers from disabling the inline styles,
	// so the minimap is always displayed normally, even when
	// every other style is disabled.
	return (
		<>
			<root.div className="rgaaExt-MinimapContainer">
				<Minimap />
				<style>{styles}</style>
			</root.div>

			<style data-rgaaext>{containerStyles}</style>
		</>
	);
};

export default MinimapContainer;
