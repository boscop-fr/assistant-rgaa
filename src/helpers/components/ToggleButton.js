import {noop} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const ToggleButton = ({pressed, onPress, onRelease, children, ...props}) => (
	<button
		className="Button"
		type="button"
		aria-pressed={pressed}
		onClick={() => (pressed ? onRelease() : onPress())}
		{...props}
	>
		{children}
	</button>
);

ToggleButton.propTypes = {
	pressed: PropTypes.bool.isRequired,
	onPress: PropTypes.func,
	onRelease: PropTypes.func,
	children: PropTypes.node.isRequired
};

ToggleButton.defaultProps = {
	onPress: noop,
	onRelease: noop
};

export default ToggleButton;
