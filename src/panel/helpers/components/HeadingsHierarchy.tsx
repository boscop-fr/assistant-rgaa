import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {browser} from '../../../common/utils/webExtension';
import {
	getHierarchy,
	setHierarchy
} from '../../../helpers/slices/headingsHierarchy';
import {
	type HeadingHierarchyNode,
	withMissingHeadings
} from '../../../helpers/utils/getHeadingsHierarchy';
import {selectTargetTabId} from '../../slices/panel';
import {useAppSelector} from '../../utils/hooks';
import {onTabMessage} from '../../utils/port';

type HeadingsHierarchyProps = {
	showMissing?: boolean;
};

const HeadingsHierarchy = ({showMissing}: HeadingsHierarchyProps) => {
	const intl = useIntl();
	const tabId = useAppSelector(selectTargetTabId);
	const [items, setItems] = useState<HeadingHierarchyNode[]>([]);
	const allItems = showMissing ? withMissingHeadings(items) : items;

	useEffect(
		() =>
			onTabMessage((action) => {
				if (setHierarchy.match(action)) {
					setItems(action.payload);
				}
			}),
		[]
	);

	useEffect(() => {
		browser.tabs
			.sendMessage(tabId, getHierarchy())
			.then((hierarchy: HeadingHierarchyNode[] | undefined) => {
				// Nothing answers if the helper isn't applied yet,
				// in which case it sends the hierarchy on its own.
				if (hierarchy) {
					setItems(hierarchy);
				}
			})
			.catch(() => {});
	}, [tabId]);

	return (
		<div className="HeadingsHierarchy Widget" aria-live="polite">
			<h6 className="HeadingsHierarchy-title">
				<FormattedMessage id="HeadingsHierarchy.title" />
			</h6>

			{allItems.length ? (
				<ul className="HeadingsHierarchy-list">
					{allItems.map(({level, text}, i) => (
						<li
							key={`${i}-${level}`}
							className={classNames('HeadingsHierarchy-item', {
								[`HeadingsHierarchy-item--level${level}`]: true,
								'HeadingsHierarchy-item--missing': !text
							})}
						>
							<span className="Label HeadingsHierarchy-level">{level}</span>
							<span className="HeadingsHierarchy-text">
								{text || intl.formatMessage({id: 'HeadingsHierarchy.missing'})}
							</span>
						</li>
					))}
				</ul>
			) : (
				<p>
					<FormattedMessage id="HeadingsHierarchy.noItems" />
				</p>
			)}
		</div>
	);
};

export default HeadingsHierarchy;
