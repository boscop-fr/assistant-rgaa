import React from 'react';
import {FormattedMessage} from 'react-intl';
import {selectHasLoadError} from '../slices/app';
import {useAppSelector} from '../utils/hooks';
import EnabledTests from './EnabledTests';
import Header from './Header';
import ReferencePage from './ReferencePage';

export default function App() {
	const hasLoadError = useAppSelector(selectHasLoadError);

	return (
		<div className="App">
			<div className="App-content">
				<Header />
				<div role="alert">
					{hasLoadError ? (
						<p className="App-error">
							<FormattedMessage id="App.loadError" />
						</p>
					) : null}
				</div>
				<ReferencePage />
				<EnabledTests />
			</div>
		</div>
	);
}
