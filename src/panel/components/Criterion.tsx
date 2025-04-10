import classNames from 'classnames';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import type {JSX} from 'react/jsx-runtime';
import type {Criterion as CriterionType} from '../../common/types';
import {selectCriterionStatus} from '../slices/audit';
import {selectIsCriterionOpen, toggleCriterion} from '../slices/criteria';
import {
	selectReferenceLinksByCriterion,
	selectSpecialCasesByCriterion,
	selectTechnicalNotesByCriterion,
	selectTestsByCriterion
} from '../slices/reference';
import {selectEnabledTestsByCriterion} from '../slices/tests';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import CriterionNotes from './CriterionNotes';
import ExternalReferences from './ExternalReferences';
import Test from './Test';
import TestStatus from './TestStatus';

type CriterionProps = {
	id: CriterionType['id'];
	level: string;
	title: string;
};

const Criterion = ({id, level, title}: CriterionProps) => {
	const intl = useIntl();
	const isOpen = useAppSelector((state) => selectIsCriterionOpen(state, id));
	const status = useAppSelector((state) => selectCriterionStatus(state, id));
	const tests = useAppSelector((state) => selectTestsByCriterion(state, id));
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

	const handleToggle = (event: JSX.TargetedEvent<HTMLElement>) => {
		event.stopPropagation();
		dispatch(toggleCriterion(id));
	};

	return (
		<li id={`Criterion-${id}`} className={className} data-id={id}>
			<header className={headerClassName}>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents : */}
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
								{intl.formatMessage({id: 'Criterion.level'}, {lvl: level})}
							</span>
						) : null}

						<div
							className="Criterion-description"
							// biome-ignore lint/security/noDangerouslySetInnerHtml :
							dangerouslySetInnerHTML={{__html: title}}
						/>
					</div>
				</div>

				<div className="Criterion-actions">
					<TestStatus status={status} />
				</div>
			</header>

			<div className="Criterion-content" id={`Criterion-${id}-content`}>
				{isOpen ? (
					<>
						{references ? (
							<details className="Criterion-details">
								<summary className="Criterion-detailsSummary">
									{intl.formatMessage({
										id: 'Criterion.tabs.references'
									})}
								</summary>

								<div className="Criterion-detailsBody">
									<ExternalReferences references={references} />
								</div>
							</details>
						) : null}

						{specialCases ? (
							<details className="Criterion-details">
								<summary className="Criterion-detailsSummary">
									{intl.formatMessage({
										id: 'Criterion.tabs.specialCases'
									})}
								</summary>

								<div className="Criterion-detailsBody">
									<CriterionNotes notes={specialCases} />
								</div>
							</details>
						) : null}

						{notes ? (
							<details className="Criterion-details">
								<summary className="Criterion-detailsSummary">
									{intl.formatMessage({
										id: 'Criterion.tabs.technicalNotes'
									})}
								</summary>

								<div className="Criterion-detailsBody">
									<CriterionNotes notes={notes} />
								</div>
							</details>
						) : null}

						<ul className="Criterion-tests">
							{Object.values(tests).map(({id: testId, title: testTitle}) => (
								<li
									className="Criterion-test"
									key={`criterion-${id}-test-${testId}`}
								>
									<Test id={testId} title={testTitle} />
								</li>
							))}
						</ul>
					</>
				) : null}
			</div>
		</li>
	);
};

export default Criterion;
