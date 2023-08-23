import React from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import AppContainer from './components/AppContainer';
import HelpPage from './components/HelpPage';
import ImportPageContainer from './components/ImportPageContainer';
import ReferencePageContainer from './components/ReferencePageContainer';

export const router = createMemoryRouter([
	{
		path: '/',
		element: <AppContainer />,
		children: [
			{
				index: true,
				element: <ReferencePageContainer />
			},
			{
				path: 'import',
				element: <ImportPageContainer />
			},
			{
				path: 'help',
				element: <HelpPage />
			}
		]
	}
]);

export default () => <RouterProvider router={router} />;
