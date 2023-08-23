import React from 'react';
import {Outlet} from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HeaderContainer from './HeaderContainer';
import AppToggle from './AppToggle';

/**
 *
 */
export default function App({folded, onUnfoldRequest}) {
	return (
		<div className="App">
			<div
				className={classNames({
					'App-content': true,
					'is-hidden': folded
				})}
			>
				<HeaderContainer />
				<Outlet />
			</div>

			<div
				className={classNames({
					'App-toggle': true,
					'is-hidden': !folded
				})}
			>
				<AppToggle onClick={onUnfoldRequest} />
			</div>
		</div>
	);
}

App.propTypes = {
	folded: PropTypes.bool.isRequired,
	onUnfoldRequest: PropTypes.func.isRequired
};
