import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link} from 'react-router-dom';
import renderIf from 'render-if';
import {truncate} from 'lodash';
import {openOptionsPage} from '../slices/options';
import {selectPageTitle, selectPopupTabId, togglePopup} from '../slices/panel';
import {selectVersion} from '../slices/reference';
import Icon from './Icon';

const Header = () => {
	const intl = useIntl();
	const version = useSelector(selectVersion);
	const isPopup = !!useSelector(selectPopupTabId);
	const title = truncate(useSelector(selectPageTitle), {omission: '…'});
	const dispatch = useDispatch();

	return (
		<header className="Header">
			<h1 className="Header-title">
				{renderIf(isPopup)(() => `${title} | `)}
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

				{renderIf(!isPopup)(() => (
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
				))}
			</div>
		</header>
	);
};

export default Header;
