import React from 'react';

type CriterionNotesProps = {
	notes: string;
};

const CriterionNotes = ({notes}: CriterionNotesProps) => (
	<div
		className="CriterionNotes"
		// biome-ignore lint/security/noDangerouslySetInnerHtml :
		dangerouslySetInnerHTML={{
			__html: notes
		}}
	/>
);

export default CriterionNotes;
