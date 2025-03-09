import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {autoToggleTest, selectEnabledTests} from '../slices/tests';
import {useAppDispatch, useAppSelector} from '../utils/hooks';

function EnabledTests() {
	const tests = useAppSelector(selectEnabledTests);
	const dispatch = useAppDispatch();
	const intl = useIntl();

	if (!tests.length) {
		return;
	}

	return (
		<section className="EnabledTests Toolbar">
			<h2 className="Toolbar-title">
				<FormattedMessage id="EnabledTests.title" />
			</h2>

			<ul className="Toolbar-actions">
				{tests.map(({id}) => (
					<li key={id} className="EnabledTests-testItem">
						<button
							className="EnabledTests-disableButton ActionButton ActionButton--small"
							title={intl.formatMessage(
								{
									id: 'EnabledTests.disableTest'
								},
								{id}
							)}
							onClick={() => {
								dispatch(autoToggleTest({id, toggle: false}));
							}}
						>
							{id}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}

export default EnabledTests;
