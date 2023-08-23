import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';
import Icon from './Icon';
import TestInstructions from './TestInstructions';
import TestHelpers from './TestHelpers';
import {isTestDone} from '../../common/selectors/checklist';
import {testHasHelpers} from '../../common/selectors/helpers';
import {isEnabled} from '../../common/selectors/tests';
import {getInstructionsByTest} from '../../common/selectors/instructions';
import {getOneTestResult} from '../../common/selectors/imports';
import {disable, enable} from '../../common/actions/tests';
import {setTestDone} from '../../common/actions/checklist';

/**
 *
 */
function Test({id, title}) {
	const done = useSelector((state) => isTestDone(state, id));
	const applicable = useSelector((state) => testHasHelpers(state, id));
	const applied = useSelector((state) => isEnabled(state, id));
	const instructions = useSelector((state) =>
		getInstructionsByTest(state, id)
	);
	const importResult = useSelector((state) => getOneTestResult(state, id));
	const dispatch = useDispatch();

	const [areInstructionsOpen, setInstructionsOpen] = useState(applied);
	const intl = useIntl();

	const handleApplyChange = (event) => {
		const {checked} = event.target;
		dispatch(checked ? enable(id) : disable(id));

		if (checked) {
			setInstructionsOpen(true);
		}
	};

	const handleDoneChange = (event) => {
		dispatch(setTestDone(id, event.target.checked));
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
					{renderIf(importResult)(() => (
						<div className="Test-action Test-action---import">
							<span
								className="Label ImportResult"
								data-import-result={importResult}
								title={intl.formatMessage({
									id: `ImportResult.${importResult}.title`
								})}
							>
								{importResult}
							</span>
						</div>
					))}

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
								onChange={handleApplyChange}
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
