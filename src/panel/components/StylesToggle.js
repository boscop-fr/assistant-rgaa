import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {selectAreStylesEnabled, toggleStyles} from '../slices/styles';
import Icon from './Icon';

const StylesToggle = () => {
	const intl = useIntl();
	const areStylesEnabled = useSelector(selectAreStylesEnabled);
	const dispatch = useDispatch();

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
			{areStylesEnabled ? <Icon name="visible" /> : <Icon name="hidden" />}
			<FormattedMessage id="ReferencePage.styles.toggle.label" />
		</button>
	);
};

export default StylesToggle;
