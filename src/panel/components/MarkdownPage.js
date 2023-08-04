import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import frontmatter from 'frontmatter';
import {marked} from 'marked';
import {replaceLocalUrls} from '../../common/api/markdown';
import Page from './Page';
import RichText from './RichText';

/**
 *
 */
const MarkdownPage = ({name}) => {
	const [page, setPage] = useState({
		title: '',
		html: ''
	});

	useEffect(() => {
		const basePath = `data/pages/${name}`;
		const url = browser.runtime.getURL(`${basePath}/index.md`);

		fetch(url)
			.then((response) => response.text())
			.then(frontmatter)
			.then(({data, content}) => {
				setPage({
					title: data.title,
					html: marked(replaceLocalUrls(content, basePath))
				});
			});
	}, []);

	return (
		<Page id={name} title={page.title}>
			<RichText html={page.html} />
		</Page>
	);
};

MarkdownPage.propTypes = {
	name: PropTypes.string.isRequired
};

export default MarkdownPage;
