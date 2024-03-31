import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import renderIf from 'render-if';
import {getHierarchy} from '../actions/headingsHierarchy';
import {createMessageHandler} from '../../common/api/runtime';

const useHierarchy = () => {
	const [items, setItems] = useState([]);
	const handleMessage = createMessageHandler((action) => {
		if (getHierarchy.match(action)) {
			setItems(action.items);
		}
	});

	useEffect(() => {
		browser.runtime.onMessage.addListener(handleMessage);

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage);
		};
	});

	return items;
};

const HeadingsHierarchy = () => {
	const items = useHierarchy();

	return (
		<div className="HeadingsHierarchy Widget" aria-live="polite">
			<h4 className="HeadingsHierarchy-title">
				<FormattedMessage id="HeadingsHierarchy.title" />
			</h4>

			{renderIf(items.length)(() => (
				<ul className="HeadingsHierarchy-list">
					{items.map(({level, text, fake}, i) => (
						<li
							// eslint-disable-next-line react/no-array-index-key
							key={i}
							className={classNames('HeadingsHierarchy-item', {
								[`HeadingsHierarchy-item--level-${level}`]: true,
								'HeadingsHierarchy-item--fake': fake
							})}
						>
							<span className="Label HeadingsHierarchy-level">
								{level}
							</span>
							<span className="HeadingsHierarchy-text">{text}</span>
						</li>
					))}
				</ul>
			))}
			{renderIf(!items.length)(() => (
				<p>
					<FormattedMessage id="HeadingsHierarchy.noItems" />
				</p>
			))}
		</div>
	);
};

export default HeadingsHierarchy;
