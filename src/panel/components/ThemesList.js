import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import renderIf from 'render-if';
import {map} from 'lodash';
import {FormattedMessage} from 'react-intl';
import {Wrapper, Button, Menu} from 'react-aria-menubutton';
import {ThemeShape} from '../../common/types/theme';
import ThemesListItem from './ThemesListItem';
import Icon from './Icon';

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

/**
 *
 */
function ThemesList({themes, isOpen, setOpen}) {
	return (
		<Wrapper
			className={classNames('ThemesList', {'is-open': isOpen})}
			onSelection={(href) => {
				document.location.href = href;
			}}
			onMenuToggle={(menu) => setOpen(menu.isOpen)}
			id="ThemesList-wrapper"
		>
			<h2 className="ThemesList-title">
				<Button className="ThemesList-toggle ActionButton" id="themesMenu">
					{renderIf(isOpen)(() => (
						<span aria-hidden="true" className="ThemesList-toggleIcon">
							▼
						</span>
					))}
					{renderIf(!isOpen)(() => (
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
}

ThemesList.propTypes = {
	themes: PropTypes.arrayOf(ThemeShape).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired
};

export default ThemesList;
