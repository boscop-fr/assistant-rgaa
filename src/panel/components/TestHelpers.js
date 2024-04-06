import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {component, describe, info} from '../../helpers/utils/helpers';
import {selectHelpersByTest} from '../slices/helpers';

function TestHelpers({id}) {
	const intl = useIntl();
	const [isOpen, setOpen] = useState(false);
	const helpers = useSelector((state) => selectHelpersByTest(state, id));
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
					{helpers.map((helper, i) => (
						// eslint-disable-next-line react/no-array-index-key
						<li key={i}>{describe(intl, helper)}</li>
					))}
				</ol>
			</div>

			<div className="TestSection-body">
				{/* show helper widgets if any */}
				{helpers
					.map((config, i) => {
						const {args} = info(config);
						const Helper = component(config);

						return Helper ? (
							// eslint-disable-next-line react/no-array-index-key
							<Helper key={i} {...args} />
						) : null;
					})
					.filter((helper) => !!helper)}
			</div>
		</div>
	);
}

TestHelpers.propTypes = {
	id: PropTypes.string.isRequired
};

export default TestHelpers;
