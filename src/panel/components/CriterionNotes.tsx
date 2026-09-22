type CriterionNotesProps = {
	notes: string;
};

const CriterionNotes = ({notes}: CriterionNotesProps) => (
	<div
		className="CriterionNotes"
		dangerouslySetInnerHTML={{
			__html: notes
		}}
	/>
);

export default CriterionNotes;
