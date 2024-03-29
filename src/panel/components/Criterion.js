/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import {map, isNull, isEmpty} from 'lodash';
import {FormattedMessage, useIntl} from 'react-intl';
import renderIf from 'render-if';
import classNames from 'classnames';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {TestShape} from '../../common/types/test';
import Test from './Test';
import Icon from './Icon';
import ExternalReferences from './ExternalReferences';
import SpecialCasesTechnicalNotes from './SpecialCasesTechnicalNotes';

/**
 *
 */
function Criterion({
	id,
	level,
	title,
	tests,
	activeTest,
	isDone,
	isOpen,
	importResults,
	onToggle,
	onDone,
	refLinks,
	specialCases,
	notes
}) {
	const intl = useIntl();
	const className = classNames('Criterion Theme-criterion', {
		'is-open': isOpen,
		'Criterion--hasActiveTest': !!activeTest
	});
	const headerClassName = classNames('Criterion-header', {
		'Title Title--sub': isOpen
	});
	const handleDoneChange = (event) => onDone(event.target.checked);

	return (
		<li id={`Criterion-${id}`} className={className} data-id={id}>
			<header className={headerClassName}>
				<div className="Criterion-title" onClick={onToggle}>
					<div className="Criterion-titleText">
						<button
							className="InvisibleButton Criterion-toggle"
							type="button"
							onClick={onToggle}
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

							{renderIf(!isOpen && activeTest)(() => (
								<span className="Criterion-activeTest">
									{intl.formatMessage(
										{id: 'Criterion.activeTest'},
										{id: activeTest.id}
									)}
								</span>
							))}
						</h3>
						{renderIf(level)(() => (
							<span className="Criterion-level">
								{intl.formatMessage(
									{id: 'Criterion.level'},
									{lvl: level}
								)}
							</span>
						))}
						<div
							className="Criterion-description"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{__html: title}}
						/>
					</div>

					{renderIf(!isOpen && importResults)(() => (
						<div className="Criterion-importResults">
							{map(importResults, (count, status, i) => (
								<span
									key={i}
									className="Label ImportResult"
									data-import-result={status}
									title={intl.formatMessage(
										{
											id: `ImportResults.${status}.title`
										},
										{
											count
										}
									)}
								>
									{count} × {status}
								</span>
							))}
						</div>
					))}
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
				{renderIf(isOpen)(() => [
					<ul className="Criterion-tests">
						{tests.map(({id: testId, title: testTitle}) => (
							<li
								className="Criterion-test"
								key={`criterion-${id}-test-${testId}`}
							>
								<Test id={testId} title={testTitle} />
							</li>
						))}
					</ul>,
					<Tabs>
						<TabList>
							{renderIf(!isEmpty(refLinks))(() => (
								<Tab>
									{intl.formatMessage({id: 'reference.tab.title'})}
								</Tab>
							))}
							{renderIf(!isNull(specialCases))(() => (
								<Tab>
									{intl.formatMessage({
										id: 'specialCases.note.tab.title'
									})}
								</Tab>
							))}
							{renderIf(!isNull(notes))(() => (
								<Tab>
									{intl.formatMessage({
										id: 'technical.note.tabs.title'
									})}
								</Tab>
							))}
						</TabList>
						{renderIf(!isEmpty(refLinks))(() => (
							<div className="Criterion-tabPanel">
								<TabPanel>
									<ExternalReferences refLinks={refLinks} intl />
								</TabPanel>

								{renderIf(!isNull(specialCases))(() => (
									<TabPanel>
										<SpecialCasesTechnicalNotes data={specialCases} />
									</TabPanel>
								))}
								{renderIf(!isNull(notes))(() => (
									<TabPanel>
										<SpecialCasesTechnicalNotes data={notes} />
									</TabPanel>
								))}
							</div>
						))}
					</Tabs>
				])}
			</div>
		</li>
	);
}

Criterion.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	level: PropTypes.string,
	tests: PropTypes.arrayOf(TestShape).isRequired,
	activeTest: TestShape,
	isOpen: PropTypes.bool.isRequired,
	importResults: PropTypes.objectOf(PropTypes.number),
	onToggle: PropTypes.func.isRequired,
	isDone: PropTypes.bool,
	onDone: PropTypes.func.isRequired,
	refLinks: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
		.isRequired,
	specialCases: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	notes: PropTypes.arrayOf(PropTypes.string)
};

Criterion.defaultProps = {
	level: undefined,
	activeTest: undefined,
	importResults: {},
	isDone: false,
	specialCases: null,
	notes: null
};

export default Criterion;
