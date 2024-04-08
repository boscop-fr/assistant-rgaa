import React, {ReactNode} from 'react';
import {MenuItem} from 'react-aria-menubutton';
import Icon from './Icon';

type ThemesListItemProps = {
	id: string;
	title: string;
	icon: string;
};

function ThemesListItem({id, title, icon}: ThemesListItemProps) {
	const props = {};
	const listItem = (tab: ReactNode) => (
		<li className="ThemesList-item" {...props}>
			{tab}
		</li>
	);

	return listItem(
		<MenuItem
			tag="a"
			className="InvisibleLink ThemesList-link"
			href={`#theme-${id}`}
			value={`#theme-${id}`}
		>
			<Icon name={icon} className="ThemesList-itemIcon" />
			{title}
		</MenuItem>
	);
}

export default ThemesListItem;
