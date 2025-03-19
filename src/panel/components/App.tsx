import React from 'react';
import EnabledTests from './EnabledTests';
import Header from './Header';
import ReferencePage from './ReferencePage';

export default function App() {
	return (
		<div className="App">
			<div className="App-content">
				<Header />
				<ReferencePage />
				<EnabledTests />
			</div>
		</div>
	);
}
