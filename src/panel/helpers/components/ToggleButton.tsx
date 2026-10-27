import type {ComponentProps, PropsWithChildren} from 'react';
import React from 'react';

type ToggleButtonProps = ComponentProps<'button'> &
	PropsWithChildren<{
		pressed: boolean;
	}>;

const ToggleButton = ({pressed, children, ...props}: ToggleButtonProps) => (
	<button className="Button" type="button" aria-pressed={pressed} {...props}>
		{children}
	</button>
);

export default ToggleButton;
