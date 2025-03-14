import classNames from 'classnames';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import type {Test} from '../../common/types';
import {helperInfo} from '../../helpers/types';
import {selectHelpersByTest} from '../slices/helpers';
import {useAppSelector} from '../utils/hooks';

type TestHelpersProps = {
	id: Test['id'];
};

function TestHelpers({id}: TestHelpersProps) {
	const intl = useIntl();
	const [isOpen, setOpen] = useState(false);
	const helpers = useAppSelector((state) => selectHelpersByTest(state, id));
	const containerClass = classNames('TestHelpers', 'TestSection', {
		'is-open': isOpen
	});
	const contentClass = classNames('TestSection-body', {
		'u-hidden': !isOpen
	});

	const toggle = () => setOpen(!isOpen);

	return (
		<div className={containerClass}>
			<h3 className="TestSection-header">
				<button
					type="button"
					className="TestSection-title TestSection-toggle InvisibleButton"
					onClick={toggle}
					aria-expanded={isOpen}
					aria-controls={`TestHelpers-${id}`}
				>
					<FormattedMessage id="TestHelpers.title" />
				</button>
			</h3>

			<div id={`TestHelpers-${id}`} className={contentClass}>
				<ol>
					{helpers.map((helper, i) => {
						const {module, args} = helperInfo(helper);

						return <li key={i}>{module.describe(intl, args)}</li>;
					})}
				</ol>
			</div>

			<div className="TestSection-body">
				{/* show helper widgets if any */}
				{helpers
					.map((helper, i) => {
						const {module, args} = helperInfo(helper);
						const Helper = module.component;

						return Helper ? <Helper key={i} {...args} /> : null;
					})
					.filter((helper) => !!helper)}
			</div>
		</div>
	);
}

export default TestHelpers;
