import classNames from 'classnames';
import {map} from 'lodash';
import React from 'react';
import {Button, Menu, Wrapper} from 'react-aria-menubutton';
import {FormattedMessage} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import renderIf from 'render-if';
import {selectAllThemes} from '../../common/slices/reference';
import {selectIsMenuOpen, toggleMenu} from '../../common/slices/themes';
import Icon from './Icon';
import ThemesListItem from './ThemesListItem';

const icons = {
	1: 'image',
	2: 'window-maximize',
	3: 'paint-brush',
	4: 'film',
	5: 'table',
	6: 'chain',
	7: 'code',
	8: 'exclamation-triangle',
	9: 'mouse-pointer',
	10: 'columns',
	11: 'list-alt',
	12: 'check-square-o',
	13: 'desktop'
};

const ThemesList = () => {
	const isMenuOpen = useSelector(selectIsMenuOpen);
	const themes = useSelector(selectAllThemes);
	const dispatch = useDispatch();

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
					{renderIf(isMenuOpen)(() => (
						<span aria-hidden="true" className="ThemesList-toggleIcon">
							▼
						</span>
					))}

					{renderIf(!isMenuOpen)(() => (
						<Icon name="list-ul" className="ThemesList-toggleIcon" />
					))}
					<FormattedMessage id="ThemesList.title" />
				</Button>
			</h2>

			<Menu tag="ul" className="ThemesList-list">
				{map(themes, (theme) => (
					<ThemesListItem
						{...theme}
						icon={icons[theme.id]}
						key={theme.id}
					/>
				))}
			</Menu>
		</Wrapper>
	);
};

export default ThemesList;
