import classNames from 'classnames';
import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import renderIf from 'render-if';
import {getHierarchy} from '../slices/headingsHierarchy';
import {useRuntimeMessage} from '../../common/utils/runtime';

const HeadingsHierarchy = () => {
	const [items, setItems] = useState([]);

	useRuntimeMessage((action) => {
		if (getHierarchy.match(action)) {
			setItems(action.payload);
		}
	});

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
