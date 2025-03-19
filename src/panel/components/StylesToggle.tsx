import {EyeIcon, EyeOffIcon} from 'lucide-react';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Icon from './Icon';

const StylesToggle = () => {
	const intl = useIntl();
	const areStylesEnabled = useAppSelector(selectAreStylesEnabled);
	const dispatch = useAppDispatch();

	return (
		<button
			className="ActionButton"
			type="button"
			onClick={() => {
				dispatch(toggleStyles(!areStylesEnabled));
			}}
			title={intl.formatMessage({
				id: `ReferencePage.styles.toggle.disabled.${
					areStylesEnabled ? 'false' : 'true'
				}`
			})}
		>
			<Icon icon={areStylesEnabled ? EyeIcon : EyeOffIcon} />
			<FormattedMessage id="ReferencePage.styles.toggle.label" />
		</button>
	);
};

export default StylesToggle;
