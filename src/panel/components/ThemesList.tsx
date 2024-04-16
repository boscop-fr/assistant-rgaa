import classNames from 'classnames';
import React, {useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {selectAllThemes} from '../slices/reference';
import {
	useAnchorEvent,
	useAppSelector,
	useFocusOutEffect
} from '../utils/hooks';
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
	const [isOpen, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>();

	const handleToggle = () => {
		setOpen((open) => !open);
	};

	useFocusOutEffect(ref, () => {
		setOpen(false);
	});

	useAnchorEvent(() => {
		setOpen(false);
	});

	return (
		<div ref={ref} className="ThemesList">
			<button
				className="ThemesList-toggle ActionButton"
				id="themesMenu"
				aria-controls="themesMenuDropdown"
				aria-expanded={isOpen}
				onClick={handleToggle}
			>
				<Icon name="list-ul" className="ThemesList-toggleIcon" />
				<FormattedMessage id="ThemesList.title" />
			</button>

			<ul
				id="themesMenuDropdown"
				className={classNames({
					'ThemesList-list': true,
					'is-open': isOpen
				})}
			>
				{Object.values(themes).map((theme) => (
					<li key={theme.id}>
						<a
							className="InvisibleLink ThemesList-link"
							href={`#theme-${theme.id}`}
						>
							<Icon
								name={icons[theme.id as keyof typeof icons]}
								className="ThemesList-itemIcon"
							/>
							{theme.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ThemesList;
