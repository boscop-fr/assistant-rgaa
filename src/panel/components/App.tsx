import React from 'react';
import {Route, Router, Switch} from 'wouter';
import {memoryLocation} from 'wouter/memory-location';
import Header from './Header';
import HelpPage from './HelpPage';
import ReferencePage from './ReferencePage';

const {hook} = memoryLocation();

export default function App() {
	return (
		<div className="App">
			<div className="App-content">
				<Router hook={hook}>
					<Header />
					<Switch>
						<Route path="/help" component={HelpPage}></Route>
						<Route component={ReferencePage}></Route>
					</Switch>
				</Router>
			</div>
		</div>
	);
}
