import {
	BookOpenTextIcon,
	ClapperboardIcon,
	CodeXmlIcon,
	GalleryVerticalIcon,
	ImageIcon,
	LayoutDashboardIcon,
	Link2Icon,
	ListIcon,
	type LucideIcon,
	NavigationIcon,
	OctagonAlertIcon,
	PaletteIcon,
	PencilRulerIcon,
	TablePropertiesIcon,
	TextCursorInputIcon
} from 'lucide-react';
import React, {useRef} from 'react';
import {FormattedMessage} from 'react-intl';
import type {Theme} from '../../common/types';
import {selectAllThemes} from '../slices/reference';
import {useAnchorEvent, useAppSelector} from '../utils/hooks';
import Icon from './Icon';

const icons: Record<Theme['id'], LucideIcon> = {
	'1': ImageIcon,
	'2': GalleryVerticalIcon,
	'3': PaletteIcon,
	'4': ClapperboardIcon,
	'5': TablePropertiesIcon,
	'6': Link2Icon,
	'7': CodeXmlIcon,
	'8': OctagonAlertIcon,
	'9': PencilRulerIcon,
	'10': LayoutDashboardIcon,
	'11': TextCursorInputIcon,
	'12': NavigationIcon,
	'13': BookOpenTextIcon
};

const ThemesList = () => {
	const themes = useAppSelector(selectAllThemes);
	const popoverRef = useRef<HTMLUListElement>();

	useAnchorEvent(() => {
		popoverRef.current.hidePopover();
	});

	return (
		<div className="ThemesList">
			<button
				id="themesMenu"
				className="ThemesList-toggle ActionButton"
				popovertarget="themesMenuDropdown"
			>
				<Icon icon={ListIcon} className="ThemesList-toggleIcon" />
				<FormattedMessage id="ThemesList.title" />
			</button>

			<ul
				ref={popoverRef}
				id="themesMenuDropdown"
				className="ThemesList-list"
				popover="auto"
				onBlur={(event) => {
					const target = event.relatedTarget as HTMLElement;

					if (!popoverRef.current.contains(target)) {
						popoverRef.current.hidePopover();
					}
				}}
			>
				{Object.values(themes).map((theme) => (
					<li key={theme.id}>
						<a
							className="InvisibleLink ThemesList-link"
							href={`#theme-${theme.id}`}
						>
							<Icon
								icon={icons[theme.id]}
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
