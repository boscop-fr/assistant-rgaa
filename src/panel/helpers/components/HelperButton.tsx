import React from 'react';

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
}: HelperButtonProps) => (
	<div className="Widget HelperButton">
		<button
			className="Button"
			type="button"
			disabled={disabled}
			onClick={onClick}
			title={title || `${name} (ouverture de page dans nouvelle fenêtre)`}
		>
			{name}
		</button>
	</div>
);

export default HelperButton;
