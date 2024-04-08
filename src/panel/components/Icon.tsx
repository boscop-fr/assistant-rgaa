import classNames from 'classnames';
import React, {ComponentProps} from 'react';

type IconProps = ComponentProps<'svg'> & {
	spritePath?: string;
	name: string;
	className?: string;
	title?: string;
};

export default function Icon({
	name,
	title,
	className,
	spritePath = '/dist/icons.svg',
	...props
}: IconProps) {
	return (
		<svg
			className={classNames('Icon', `Icon--${name}`, className)}
			role={title ? 'img' : null}
			aria-label={title}
			aria-hidden={title ? null : true}
			{...props}
		>
			{title ? <desc>{title}</desc> : null}
			<use xlinkHref={`${spritePath}#${name}`} />
		</svg>
	);
}
