import React from 'react';
import {useIntl} from 'react-intl';
import type {TestStatus as TestStatusType} from '../../common/types';

type TestStatusProps = {
	status: TestStatusType;
	isInline?: boolean;
};

const TestStatus = ({status, isInline = false}: TestStatusProps) => {
	const intl = useIntl();
	const Element = isInline ? 'span' : 'p';

	return (
		<Element
			className={`TestStatus TestStatus--${status}`}
			title={intl.formatMessage({id: 'TestStatus.title'}, {status})}
		>
			{status}
		</Element>
	);
};

export default TestStatus;
