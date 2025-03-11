import {AppWindowIcon, CircleHelpIcon, SettingsIcon} from 'lucide-react';
import React from 'react';
import {useIntl} from 'react-intl';
import {openOptionsPage} from '../slices/options';
import {selectPageTitle, selectPopupTabId, togglePopup} from '../slices/panel';
import {selectVersion} from '../slices/reference';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';
import StylesToggle from './StylesToggle';
import ThemesList from './ThemesList';

const Header = () => {
	const intl = useIntl();
	const version = useAppSelector(selectVersion);
	const isPopup = !!useAppSelector(selectPopupTabId);
	const title = useAppSelector(selectPageTitle);
	const dispatch = useAppDispatch();
	const helpTitle = intl.formatMessage({id: 'Header.help'});
	const optionsTitle = intl.formatMessage({id: 'Header.options'});
	const popupTitle = intl.formatMessage({id: 'Header.openPopup'});

	return (
		<header className="Header Toolbar">
			<h1 className="Toolbar-title Toolbar-title--wide ">
				{isPopup ? `${title} | ` : null}
				RGAA v{version}
			</h1>

			<div className="Toolbar-actions">
				<a
					className="Header-help Link"
					href="http://assistant-rgaa.boscop.fr/#fonctionnalites"
					target="_blank"
					title={helpTitle}
				>
					<Icon icon={CircleHelpIcon} title={helpTitle} />
				</a>

				<button
					type="button"
					onClick={() => {
						dispatch(openOptionsPage());
					}}
					className="Header-options Link"
					title={optionsTitle}
				>
					<Icon icon={SettingsIcon} title={optionsTitle} />
				</button>

				{isPopup ? null : (
					<button
						type="button"
						onClick={() => {
							dispatch(togglePopup());
						}}
						className="Header-openPopup InvisibleButton"
						title={popupTitle}
					>
						<Icon icon={AppWindowIcon} title={popupTitle} />
					</button>
				)}
			</div>

			<div className="Toolbar-actions">
				<ThemesList />
				<StylesToggle />
			</div>
		</header>
	);
};

export default Header;
