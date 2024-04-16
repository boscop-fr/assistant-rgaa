import React from 'react';
import {
	Button,
	Menu,
	MenuItem,
	MenuTrigger,
	Popover
} from 'react-aria-components';
import {FormattedMessage} from 'react-intl';
import {selectAllThemes} from '../slices/reference';
import {useAppSelector} from '../utils/hooks';
import Icon from './Icon';

const icons = {
	'1': 'image',
	'2': 'window-maximize',
	'3': 'paint-brush',
	'4': 'film',
	'5': 'table',
	'6': 'chain',
	'7': 'code',
	'8': 'exclamation-triangle',
	'9': 'mouse-pointer',
	'10': 'columns',
	'11': 'list-alt',
	'12': 'check-square-o',
	'13': 'desktop'
};

const ThemesList = () => {
	const themes = useAppSelector(selectAllThemes);

	return (
		<MenuTrigger>
			<div className="ThemesList">
				<Button className="ThemesList-toggle ActionButton" id="themesMenu">
					<Icon name="list-ul" className="ThemesList-toggleIcon" />
					<FormattedMessage id="ThemesList.title" />
				</Button>

				<Popover>
					<Menu className="ThemesList-list">
						<>
							{Object.values(themes).map((theme) => (
								<MenuItem
									key={theme.id}
									className="InvisibleLink ThemesList-link"
									href={`#theme-${theme.id}`}
								>
									<Icon
										name={icons[theme.id as keyof typeof icons]}
										className="ThemesList-itemIcon"
									/>
									{theme.title}
								</MenuItem>
							))}
						</>
					</Menu>{' '}
				</Popover>
			</div>
		</MenuTrigger>
	);
};

export default ThemesList;
