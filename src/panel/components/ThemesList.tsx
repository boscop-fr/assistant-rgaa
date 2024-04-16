import classNames from 'classnames';
import React from 'react';
import {Button, Menu, Wrapper} from 'react-aria-menubutton';
import {FormattedMessage} from 'react-intl';
import {selectAllThemes} from '../slices/reference';
import {selectIsMenuOpen, toggleMenu} from '../slices/themes';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';
import ThemesListItem from './ThemesListItem';

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
	const isMenuOpen = useAppSelector(selectIsMenuOpen);
	const themes = useAppSelector(selectAllThemes);
	const dispatch = useAppDispatch();

	return (
		<Wrapper
			className={classNames('ThemesList', {'is-open': isMenuOpen})}
			onSelection={(href) => {
				document.location.href = href;
			}}
			onMenuToggle={(menu) => {
				dispatch(toggleMenu(menu.isOpen));
			}}
			id="ThemesList-wrapper"
		>
			<h2 className="ThemesList-title">
				<Button className="ThemesList-toggle ActionButton" id="themesMenu">
					{isMenuOpen ? (
						<span aria-hidden="true" className="ThemesList-toggleIcon">
							▼
						</span>
					) : (
						<Icon name="list-ul" className="ThemesList-toggleIcon" />
					)}

					<FormattedMessage id="ThemesList.title" />
				</Button>
			</h2>

			<Menu tag="ul" className="ThemesList-list">
				<>
					{Object.values(themes).map((theme) => (
						<ThemesListItem
							{...theme}
							icon={icons[theme.id as keyof typeof icons]}
							key={theme.id}
						/>
					))}
				</>
			</Menu>
		</Wrapper>
	);
};

export default ThemesList;
