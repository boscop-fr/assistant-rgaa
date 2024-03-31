import React from 'react';
import {Outlet} from 'react-router';
import Header from './Header';

/**
 *
 */
export default function App() {
	return (
		<div className="App">
			<div className="App-content">
				<Header />
				<Outlet />
			</div>
		</div>
	);
}
