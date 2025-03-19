import {
	AppWindowIcon,
	CircleHelpIcon,
	DatabaseBackupIcon,
	SettingsIcon
} from 'lucide-react';
import React from 'react';
import {useIntl} from 'react-intl';
import {openOptionsPage} from '../slices/options';
import {
	selectPopupTabId,
	selectTargetTabTitle,
	togglePopup
} from '../slices/panel';
import {selectVersion} from '../slices/reference';
import {stateReset} from '../slices/storage';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';
import StylesToggle from './StylesToggle';
import ThemesList from './ThemesList';

const Header = () => {
	const intl = useIntl();
	const version = useAppSelector(selectVersion);
	const isPopup = !!useAppSelector(selectPopupTabId);
	const title = useAppSelector(selectTargetTabTitle);
	const dispatch = useAppDispatch();
	const resetTitle = intl.formatMessage({id: 'Header.reset'});
	const popupTitle = intl.formatMessage({id: 'Header.openPopup'});
	const optionsTitle = intl.formatMessage({id: 'Header.options'});
	const helpTitle = intl.formatMessage({id: 'Header.help'});

	return (
		<header className="Header Toolbar">
			<h1 className="Toolbar-title Toolbar-title--wide ">
				{isPopup ? `${title} | ` : null}
				RGAA v{version}
			</h1>

			<div className="Toolbar-actions">
				{isPopup ? null : (
					<button
						type="button"
						onClick={() => {
							dispatch(togglePopup());
						}}
						className="Header-action InvisibleButton"
						title={popupTitle}
					>
						<Icon icon={AppWindowIcon} title={popupTitle} />
					</button>
				)}

				<button
					type="button"
					onClick={() => {
						dispatch(stateReset());
					}}
					className="Header-action InvisibleButton"
					title={resetTitle}
				>
					<Icon icon={DatabaseBackupIcon} title={resetTitle} />
				</button>

				<button
					type="button"
					onClick={() => {
						dispatch(openOptionsPage());
					}}
					className="Header-action Link"
					title={optionsTitle}
				>
					<Icon icon={SettingsIcon} title={optionsTitle} />
				</button>

				<a
					className="Header-action Link"
					href="http://assistant-rgaa.boscop.fr/#fonctionnalites"
					target="_blank"
					title={helpTitle}
					rel="noreferrer"
				>
					<Icon icon={CircleHelpIcon} title={helpTitle} />
				</a>
			</div>

			<div className="Toolbar-actions">
				<ThemesList />
				<StylesToggle />
			</div>
		</header>
	);
};

export default Header;
