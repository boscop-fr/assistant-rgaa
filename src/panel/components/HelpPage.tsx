import React from 'react';
import {useIntl} from 'react-intl';
import html from '../../../data/pages/help/fr.md';
import {replaceLocalUrls} from '../utils/markdown';
import Page from './Page';
import RichText from './RichText';

const HelpPage = () => {
	const intl = useIntl();

	return (
		<Page id="help" title={intl.formatMessage({id: 'HelpPage.title'})}>
			<RichText html={replaceLocalUrls(html, 'data/pages/help')} />
		</Page>
	);
};

export default HelpPage;
