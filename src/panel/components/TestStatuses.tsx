import React, {ChangeEventHandler} from 'react';
import {useIntl} from 'react-intl';
import {Test, type TestStatus as TestStatusType} from '../../common/types';
import {selectTestStatus, setTestStatus} from '../slices/audit';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import TestStatus from './TestStatus';

type TestStatusesProps = {
	id: Test['id'];
	isReadOnly: boolean;
};

const STATUSES: TestStatusType[] = ['C', 'NC', 'NA', 'NT'];

const TestStatuses = ({id, isReadOnly = true}: TestStatusesProps) => {
	const actualStatus = useAppSelector((state) => selectTestStatus(state, id));
	const dispatch = useAppDispatch();
	const intl = useIntl();

	if (isReadOnly) {
		return <TestStatus status={actualStatus} />;
	}

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		dispatch(
			setTestStatus({
				id,
				status: event.currentTarget.value as TestStatusType
			})
		);
	};

	return (
		<fieldset className="TestStatuses">
			<legend className="ScreenReaderOnly">
				{intl.formatMessage({id: 'TestStatuses.legend'})}
			</legend>

			<div className="TestStatuses-options">
				{STATUSES.map((status) => {
					const inputId = `TestStatus--${id}-${status}`;

					return (
						<div key={status}>
							<input
								type="radio"
								id={inputId}
								className="TestStatuses-field ScreenReaderOnly"
								name={`TestStatus--${id}`}
								value={status}
								checked={status === actualStatus}
								data-checked={status === actualStatus}
								onChange={handleChange}
							/>

							<label htmlFor={inputId}>
								<TestStatus status={status} isInline />
								{''}
							</label>
						</div>
					);
				})}
			</div>
		</fieldset>
	);
};

export default TestStatuses;
