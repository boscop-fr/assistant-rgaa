import React from 'react';
import DevTools from './DevTools';
import Header from './Header';
import ReferencePage from './ReferencePage';

export default function App() {
	return (
		<div className="App">
			<div className="App-content">
				<Header />
				<ReferencePage />
				{process.env.NODE_ENV === 'production' ? null : <DevTools />}
			</div>
		</div>
	);
}
