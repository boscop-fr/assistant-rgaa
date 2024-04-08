import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';

type PageProps = PropsWithChildren<{
	id?: string;
	title: string;
}>;

const Page = ({id = '', title, children}: PageProps) => (
	<div
		className={classNames({
			Page: true,
			[`Page--${id}`]: !!id
		})}
	>
		<h1 className="Page-title Title">{title}</h1>

		<div className="Page-body">{children}</div>
	</div>
);

export default Page;
