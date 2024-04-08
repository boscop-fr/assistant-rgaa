import frontmatter from 'frontmatter';
import {marked} from 'marked';
import React, {useEffect, useState} from 'react';
import {replaceLocalUrls} from '../utils/markdown';
import Page from './Page';
import RichText from './RichText';

type MarkdownPageProps = {
	name: string;
};

const MarkdownPage = ({name}: MarkdownPageProps) => {
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

export default MarkdownPage;
