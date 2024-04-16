import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link} from 'react-router-dom';
import {openOptionsPage} from '../slices/options';
import {selectPageTitle, selectPopupTabId, togglePopup} from '../slices/panel';
import {selectVersion} from '../slices/reference';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';

const Header = () => {
	const intl = useIntl();
	const version = useAppSelector(selectVersion);
	const isPopup = !!useAppSelector(selectPopupTabId);
	const title = useAppSelector(selectPageTitle);
	const dispatch = useAppDispatch();

	return (
		<header className="Header">
			<h1 className="Header-title">
				{isPopup ? `${title} | ` : null}
				RGAA v{version}
			</h1>

			<div className="Header-actions">
				<Link className="Header-themes Link" to="/">
					<FormattedMessage id="Header.themes" />
				</Link>

				<Link className="Header-help Link" to="/help">
					<FormattedMessage id="Header.help" />
				</Link>

				<div className="Header-dock" />

				<button
					type="button"
					onClick={() => {
						dispatch(openOptionsPage());
					}}
					className="Header-options Link"
					title={intl.formatMessage({id: 'Header.options'})}
				>
					<Icon
						name="cog"
						title={intl.formatMessage({id: 'Header.options'})}
					/>
				</button>

				{isPopup ? null : (
					<button
						type="button"
						onClick={() => {
							dispatch(togglePopup());
						}}
						className="Header-openPopup InvisibleButton"
						title={intl.formatMessage({id: 'Header.openPopup'})}
					>
						<Icon
							name="popup"
							title={intl.formatMessage({id: 'Header.openPopup'})}
						/>
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
