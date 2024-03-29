import React from 'react';
import {Outlet} from 'react-router';
import HeaderContainer from './HeaderContainer';

/**
 *
 */
export default function App() {
	return (
		<div className="App">
			<div className="App-content">
				<HeaderContainer />
				<Outlet />
			</div>
		</div>
	);
}
