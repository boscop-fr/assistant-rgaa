import classNames from 'classnames';
import React from 'react';
import {FormattedMessage} from 'react-intl';

type TestInstructionsProps = {
	id: string;
	instructions: string;
	isOpen: boolean;
	onToggleRequest: (toggled: boolean) => void;
};

function TestInstructions({
	id,
	isOpen,
	onToggleRequest,
	instructions
}: TestInstructionsProps) {
	const containerClass = classNames('TestInstructions', 'TestSection', {
		'is-open': isOpen
	});
	const textClass = classNames('TestSection-body', {
		'u-hidden': !isOpen
	});

	const toggle = () => onToggleRequest(!isOpen);

	return (
		<div className={containerClass}>
			<h3 className="TestSection-header">
				<button
					type="button"
					className="TestSection-title TestSection-toggle InvisibleButton"
					onClick={toggle}
					aria-expanded={isOpen}
					aria-controls={`TestInstructions-${id}`}
				>
					<FormattedMessage id="Test.instructions" />
				</button>
			</h3>

			<div
				id={`TestInstructions-${id}`}
				className={textClass}
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: instructions
				}}
			/>
		</div>
	);
}

export default TestInstructions;
