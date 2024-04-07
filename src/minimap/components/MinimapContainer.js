import React from 'react';
import root from 'react-shadow';
import styles from '../../../css/minimap/index.scss';
import Minimap from './Minimap';

// We're using a simple set of inline styles here to avoid
// running a whole build step for less than 10 lines of CSS.
const CONTAINER_STYLES = `
	.rgaaExt-MinimapContainer {
		all: initial;
		display: none;
		position: fixed;
		inset: 0 0 0 auto;
	}

	.rgaaExt-Body--withHelpers .rgaaExt-MinimapContainer {
		display: block;
	}
`;

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

			<style data-rgaaext>{CONTAINER_STYLES}</style>
		</>
	);
};

export default MinimapContainer;
