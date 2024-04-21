import classNames from 'classnames';
import {type LucideIcon} from 'lucide-react';
import React from 'react';

type IconProps = {
	icon: LucideIcon;
	className?: string;
	title?: string;
};

export default function Icon({icon, title, className, ...props}: IconProps) {
	const Component = icon;
	return (
		<Component
			{...props}
			className={classNames('Icon', `Icon--${name}`, className)}
			size={16}
			role={title ? 'img' : null}
			aria-label={title}
			aria-hidden={title ? null : true}
		/>
	);
}
