import React from 'react';
import {CriterionSpecialCase} from '../../common/types';

type SpecialCasesTechnicalNotesProps = {
	data?: CriterionSpecialCase[];
};

function SpecialCasesTechnicalNotes({data}: SpecialCasesTechnicalNotesProps) {
	return (
		<div className="SpecialCases">
			{data
				? data.map((values, i) => {
						if (typeof values === 'string') {
							return (
								<div
									// eslint-disable-next-line react/no-array-index-key
									key={i}
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{__html: values}}
								/>
							);
						}

						return Object.values(values).map((value, k) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={k}
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={{__html: value}}
							/>
						));
				  })
				: null}
		</div>
	);
}

export default SpecialCasesTechnicalNotes;
