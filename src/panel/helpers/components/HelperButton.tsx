import React from 'react';
import {useIntl} from 'react-intl';

type HelperButtonProps = {
	name: string;
	title?: string;
	disabled?: boolean;
	onClick?: () => void;
};

const HelperButton = ({
	name,
	title = '',
	disabled = false,
	onClick
}: HelperButtonProps) => {
	const intl = useIntl();

	return (
		<div className="Widget HelperButton">
			<button
				className="Button"
				type="button"
				disabled={disabled}
				onClick={onClick}
				title={title || intl.formatMessage({id: 'HelperButton.title'}, {name})}
			>
				{name}
			</button>
		</div>
	);
};

export default HelperButton;
