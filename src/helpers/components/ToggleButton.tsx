import type {ComponentProps, PropsWithChildren} from 'react';
import React from 'react';

type ToggleButtonProps = ComponentProps<'button'> &
	PropsWithChildren<{
		pressed: boolean;
		onPress?: () => void;
		onRelease?: () => void;
	}>;

const ToggleButton = ({
	pressed,
	onPress,
	onRelease,
	children,
	...props
}: ToggleButtonProps) => (
	<button
		className="Button"
		type="button"
		aria-pressed={pressed}
		onClick={() => (pressed ? onRelease?.() : onPress?.())}
		{...props}
	>
		{children}
	</button>
);

export default ToggleButton;
