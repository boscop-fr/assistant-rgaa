import React from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import App from './components/App';
import HelpPage from './components/HelpPage';
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
				path: 'help',
				element: <HelpPage />
			}
		]
	}
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
