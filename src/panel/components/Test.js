import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';
import Icon from './Icon';
import TestInstructions from './TestInstructions';
import TestHelpers from './TestHelpers';
import {
	disableTest,
	enableTest,
	selectIsTestEnabled
} from '../../common/slices/tests';
import {selectTestHasHelpers} from '../../common/slices/helpers';
import {markTestDone, selectIsTestDone} from '../../common/slices/checklist';
import {selectInstructionsByTest} from '../../common/slices/instructions';

/**
 *
 */
function Test({id, title}) {
	const intl = useIntl();
	const done = useSelector((state) => selectIsTestDone(state, id));
	const applicable = useSelector((state) => selectTestHasHelpers(state, id));
	const applied = useSelector((state) => selectIsTestEnabled(state, id));
	const instructions = useSelector((state) =>
		selectInstructionsByTest(state, id)
	);

	const [areInstructionsOpen, setInstructionsOpen] = useState(applied);
	const dispatch = useDispatch();

	const handleToggle = () => {
		if (applied) {
			dispatch(disableTest(id));
		} else {
			dispatch(enableTest(id));
			setInstructionsOpen(true);
		}
	};

	const handleDoneChange = (event) => {
		dispatch(
			markTestDone({
				id,
				done: event.target.checked
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
					{renderIf(applicable)(() => (
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
					))}

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

			{renderIf(instructions)(() => (
				<TestInstructions
					id={id}
					instructions={instructions}
					isOpen={areInstructionsOpen}
					onToggleRequest={setInstructionsOpen}
				/>
			))}

			{renderIf(applied)(() => (
				<TestHelpers id={id} />
			))}
		</article>
	);
}

Test.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default Test;
