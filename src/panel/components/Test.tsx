import classNames from 'classnames';
import {type JSX} from 'react/jsx-runtime';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {type Test} from '../../common/types';
import {markTestDone, selectIsTestDone} from '../slices/checklist';
import {selectTestHasHelpers} from '../slices/helpers';
import {selectInstructionsByTest} from '../slices/instructions';
import {disableTest, enableTest, selectIsTestEnabled} from '../slices/tests';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';
import TestHelpers from './TestHelpers';
import TestInstructions from './TestInstructions';

type TestProps = {
	id: Test['id'];
	title: string;
};

function Test({id, title}: TestProps) {
	const intl = useIntl();
	const done = useAppSelector((state) => selectIsTestDone(state, id));
	const applicable = useAppSelector((state) =>
		selectTestHasHelpers(state, id)
	);
	const applied = useAppSelector((state) => selectIsTestEnabled(state, id));
	const instructions = useAppSelector((state) =>
		selectInstructionsByTest(state, id)
	);

	const [areInstructionsOpen, setInstructionsOpen] = useState(applied);
	const dispatch = useAppDispatch();

	const handleToggle = () => {
		if (applied) {
			dispatch(disableTest(id));
		} else {
			dispatch(enableTest(id));
			setInstructionsOpen(true);
		}
	};

	const handleDoneChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
		dispatch(
			markTestDone({
				id,
				done: event.currentTarget.checked
			})
		);
	};

	const applyTranslateKey = applied ? 'uncheck' : 'check';
	const className = classNames({
		Test: true,
		'is-applied': applied
	});

	return (
		<article className={className}>
			<header className="Test-header">
				<div className="Test-title">
					<h4 className="Test-id">
						{intl.formatMessage({id: 'Test.title'}, {id})}
					</h4>

					<div
						className="Test-description"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{
							__html: title
						}}
					/>
				</div>

				<div className="Test-actions">
					{applicable ? (
						<div className="Test-action Test-action---apply">
							<input
								title={intl.formatMessage(
									{
										id: `Test.apply.${applyTranslateKey}.title`
									},
									{id}
								)}
								className="Test-actionInput"
								type="checkbox"
								id={`test-${id}-apply-input`}
								checked={applied}
								onChange={handleToggle}
							/>
						</div>
					) : null}

					<div
						className={classNames('Test-action Test-action--done', {
							'Test-action--checked': done
						})}
					>
						<label
							htmlFor={`test-${id}-done-input`}
							className="Test-actionLabel"
							title={intl.formatMessage({
								id: done ? 'Test.done' : 'Test.todo'
							})}
						>
							<Icon name="flag" />
						</label>

						<input
							className="Test-actionInput u-hidden"
							type="checkbox"
							id={`test-${id}-done-input`}
							checked={done}
							onChange={handleDoneChange}
						/>
					</div>
				</div>
			</header>

			{instructions ? (
				<TestInstructions
					id={id}
					instructions={instructions}
					isOpen={areInstructionsOpen}
					onToggleRequest={setInstructionsOpen}
				/>
			) : null}

			{applied ? <TestHelpers id={id} /> : null}
		</article>
	);
}

export default Test;
