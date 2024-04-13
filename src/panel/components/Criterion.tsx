/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import {isEmpty, isNull} from 'lodash';
import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {type Criterion} from '../../common/types';
import {markTestDone, selectAreAllTestsDone} from '../slices/checklist';
import {selectIsCriterionOpen, toggleCriterion} from '../slices/criteria';
import {
	selectReferenceLinksByCriterion,
	selectSpecialCasesByCriterion,
	selectTechnicalNotesByCriterion,
	selectTestsByCriterion
} from '../slices/reference';
import {selectEnabledTestsByCriterion} from '../slices/tests';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import ExternalReferences from './ExternalReferences';
import Icon from './Icon';
import SpecialCasesTechnicalNotes from './SpecialCasesTechnicalNotes';
import Test from './Test';

type CriterionProps = {
	id: Criterion['id'];
	level: string;
	title: string;
};

const Criterion = ({id, level, title}: CriterionProps) => {
	const intl = useIntl();
	const isOpen = useAppSelector((state) => selectIsCriterionOpen(state, id));
	const tests = useAppSelector((state) => selectTestsByCriterion(state, id));
	const isDone = useAppSelector((state) =>
		selectAreAllTestsDone(state, tests)
	);
	const references = useAppSelector((state) =>
		selectReferenceLinksByCriterion(state, id)
	);
	const specialCases = useAppSelector((state) =>
		selectSpecialCasesByCriterion(state, id)
	);
	const notes = useAppSelector((state) =>
		selectTechnicalNotesByCriterion(state, id)
	);
	const enabledTests = useAppSelector((state) =>
		selectEnabledTestsByCriterion(state, id)
	);
	const activeTest = isOpen ? enabledTests?.[0] : null;
	const dispatch = useAppDispatch();

	const className = classNames('Criterion Theme-criterion', {
		'is-open': isOpen,
		'Criterion--hasActiveTest': !!activeTest
	});

	const headerClassName = classNames('Criterion-header', {
		'Title Title--sub': isOpen
	});

	const handleDoneChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		tests.forEach((test) =>
			dispatch(
				markTestDone({
					id: test.id,
					done: event.target.checked
				})
			)
		);
	};

	const handleToggle: MouseEventHandler<HTMLElement> = (event) => {
		event.stopPropagation();
		dispatch(toggleCriterion(id));
	};

	return (
		<li id={`Criterion-${id}`} className={className} data-id={id}>
			<header className={headerClassName}>
				<div className="Criterion-title" onClick={handleToggle}>
					<div className="Criterion-titleText">
						<button
							className="InvisibleButton Criterion-toggle"
							type="button"
							onClick={handleToggle}
							aria-expanded={isOpen}
							aria-controls={`Criterion-${id}-content`}
						>
							<span className="ScreenReaderOnly">
								<FormattedMessage
									id={`Criterion.toggle.${isOpen ? 'hide' : 'show'}`}
									values={{
										id
									}}
								/>
							</span>
						</button>

						<h3 className="Criterion-id">
							{intl.formatMessage({id: 'Criterion.title'}, {id})}

							{!isOpen && activeTest ? (
								<span className="Criterion-activeTest">
									{intl.formatMessage(
										{id: 'Criterion.activeTest'},
										{id: activeTest.id}
									)}
								</span>
							) : null}
						</h3>

						{level ? (
							<span className="Criterion-level">
								{intl.formatMessage(
									{id: 'Criterion.level'},
									{lvl: level}
								)}
							</span>
						) : null}

						<div
							className="Criterion-description"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{__html: title}}
						/>
					</div>
				</div>

				<div className="Criterion-actions">
					<div
						className={classNames(
							'Criterion-action Criterion-action--done',
							{
								'Criterion-action--checked': isDone
							}
						)}
					>
						<label
							htmlFor={`criterion-${id}-done-input`}
							className="Criterion-actionLabel"
							title={intl.formatMessage({
								id: isDone
									? 'Criterion.done.label'
									: 'Criterion.todo.label'
							})}
						>
							<Icon name="flag" />
						</label>

						<input
							type="checkbox"
							id={`criterion-${id}-done-input`}
							className="u-hidden"
							checked={isDone}
							onChange={handleDoneChange}
						/>
					</div>
				</div>
			</header>

			<div className="Criterion-content" id={`Criterion-${id}-content`}>
				{isOpen ? (
					<>
						<ul className="Criterion-tests">
							{tests.map(({id: testId, title: testTitle}) => (
								<li
									className="Criterion-test"
									key={`criterion-${id}-test-${testId}`}
								>
									<Test id={testId} title={testTitle} />
								</li>
							))}
						</ul>

						<Tabs>
							<TabList>
								{isEmpty(references) ? null : (
									<Tab>
										{intl.formatMessage({id: 'reference.tab.title'})}
									</Tab>
								)}

								{isNull(specialCases) ? null : (
									<Tab>
										{intl.formatMessage({
											id: 'specialCases.note.tab.title'
										})}
									</Tab>
								)}

								{isNull(notes) ? null : (
									<Tab>
										{intl.formatMessage({
											id: 'technical.note.tabs.title'
										})}
									</Tab>
								)}
							</TabList>

							{isEmpty(references) ? null : (
								<div className="Criterion-tabPanel">
									<TabPanel>
										<ExternalReferences references={references} />
									</TabPanel>

									{isNull(specialCases) ? null : (
										<TabPanel>
											<SpecialCasesTechnicalNotes
												data={specialCases}
											/>
										</TabPanel>
									)}

									{isNull(notes) ? null : (
										<TabPanel>
											<SpecialCasesTechnicalNotes data={notes} />
										</TabPanel>
									)}
								</div>
							)}
						</Tabs>
					</>
				) : null}
			</div>
		</li>
	);
};

export default Criterion;
