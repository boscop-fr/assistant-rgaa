import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {sendMessage, useRuntimeMessage} from '../../common/utils/runtime';
import {getHierarchy, setHierarchy} from '../slices/headingsHierarchy';
import {
	type HeadingHierarchyNode,
	withMissingHeadings
} from '../utils/getHeadingsHierarchy';

type HeadingsHierarchyProps = {
	showMissing?: boolean;
};

const HeadingsHierarchy = ({showMissing}: HeadingsHierarchyProps) => {
	const [items, setItems] = useState<HeadingHierarchyNode[]>([]);
	const allItems = showMissing ? withMissingHeadings(items) : items;

	useRuntimeMessage((action: unknown) => {
		if (setHierarchy.match(action)) {
			setItems(action.payload);
		}
	});

	useEffect(() => {
		sendMessage(getHierarchy());
	}, []);

	return (
		<div className="HeadingsHierarchy Widget" aria-live="polite">
			<h4 className="HeadingsHierarchy-title">
				<FormattedMessage id="HeadingsHierarchy.title" />
			</h4>

			{allItems.length ? (
				<ul className="HeadingsHierarchy-list">
					{allItems.map(({level, text}, i) => (
						<li
							// eslint-disable-next-line react/no-array-index-key
							key={i}
							className={classNames('HeadingsHierarchy-item', {
								[`HeadingsHierarchy-item--level${level}`]: true,
								'HeadingsHierarchy-item--missing': !text
							})}
						>
							<span className="Label HeadingsHierarchy-level">
								{level}
							</span>
							<span className="HeadingsHierarchy-text">
								{text || 'Titre manquant'}
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
