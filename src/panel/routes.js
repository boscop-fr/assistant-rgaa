import React from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import App from './components/App';
import MarkdownPage from './components/MarkdownPage';
import ImportPage from './components/ImportPage';
import ReferencePage from './components/ReferencePage';

export const router = createMemoryRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <ReferencePage />
			},
			{
				path: 'import',
				element: <ImportPage />
			},
			{
				path: 'help',
				element: <MarkdownPage name="help" />
			}
		]
	}
]);

export default () => <RouterProvider router={router} />;
