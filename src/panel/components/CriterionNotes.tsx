import React from 'react';

type CriterionNotesProps = {
	notes: string;
};

const CriterionNotes = ({notes}: CriterionNotesProps) => (
	<div
		className="CriterionNotes"
		// eslint-disable-next-line react/no-danger
		dangerouslySetInnerHTML={{
			__html: notes
		}}
	/>
);

export default CriterionNotes;
