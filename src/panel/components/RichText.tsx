import React from 'react';

type RichTextProps = {
	html: string;
};

const RichText = ({html}: RichTextProps) => (
	<div
		className="RichText"
		// eslint-disable-next-line react/no-danger
		dangerouslySetInnerHTML={{
			__html: html
		}}
	/>
);

export default RichText;
