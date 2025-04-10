import classNames from 'classnames';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import type {Test as TestType} from '../../common/types';
import {useOption} from '../../options/utils/storage';
import {selectTestHasHelpers} from '../slices/helpers';
import {selectInstructionsByTest} from '../slices/instructions';
import {autoToggleTest, selectIsTestEnabled} from '../slices/tests';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import TestHelpers from './TestHelpers';
import TestInstructions from './TestInstructions';
import TestStatuses from './TestStatuses';

type TestProps = {
	id: TestType['id'];
	title: string;
};

function Test({id, title}: TestProps) {
	const intl = useIntl();
	const applicable = useAppSelector((state) => selectTestHasHelpers(state, id));
	const applied = useAppSelector((state) => selectIsTestEnabled(state, id));
	const instructions = useAppSelector((state) =>
		selectInstructionsByTest(state, id)
	);

	const autoOpenInstructions = useOption('autoOpenInstructions');
	const [areInstructionsOpen, setInstructionsOpen] = useState(applied);
	const dispatch = useAppDispatch();

	const handleToggle = () => {
		const toggle = !applied;
		dispatch(autoToggleTest({id, toggle}));

		if (toggle && autoOpenInstructions) {
			setInstructionsOpen(true);
		}
	};

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
						// biome-ignore lint/security/noDangerouslySetInnerHtml :
						dangerouslySetInnerHTML={{
							__html: title
						}}
					/>
				</div>

				<div className="Test-actions">
					{applicable ? (
						<div className="Test-action Test-action--application">
							<label
								title={intl.formatMessage(
									{
										id: 'Test.apply.title'
									},
									{id, applied}
								)}
							>
								<input
									type="checkbox"
									id={`test-${id}-apply-input`}
									checked={applied}
									onChange={handleToggle}
								/>
							</label>
						</div>
					) : null}

					<div className="Test-action">
						<TestStatuses id={id} isReadOnly={!applied} />
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
