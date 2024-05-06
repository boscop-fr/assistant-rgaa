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
		<section className="EnabledTests">
			<header className="EnabledTests-header">
				<h2 className="EnabledTests-title Title">
					<FormattedMessage id="EnabledTests.title" />
				</h2>
			</header>

			<ul className="EnabledTests-testList">
				{tests.map(({id}) => (
					<li key={id} className="EnabledTests-testItem">
						<button
							className="Button EnabledTests-disableButton"
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
