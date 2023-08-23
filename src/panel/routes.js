import React from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import AppContainer from './components/AppContainer';
import MarkdownPage from './components/MarkdownPage';
import ImportPageContainer from './components/ImportPageContainer';
import ReferencePage from './components/ReferencePage';

export const router = createMemoryRouter([
	{
		path: '/',
		element: <AppContainer />,
		children: [
			{
				index: true,
				element: <ReferencePage />
			},
			{
				path: 'import',
				element: <ImportPageContainer />
			},
			{
				path: 'help',
				element: <MarkdownPage name="help" />
			}
		]
	}
]);

export default () => <RouterProvider router={router} />;
