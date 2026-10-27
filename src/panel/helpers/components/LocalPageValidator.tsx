import React from 'react';
import {useIntl} from 'react-intl';
import {validatePage} from '../../../background/slices/runtime';
import {isFirefox} from '../../../common/utils/browser';
import {browser} from '../../../common/utils/webExtension';
import {selectTargetTabUrl} from '../../slices/panel';
import {useAppSelector} from '../../utils/hooks';
import HelperButton from './HelperButton';

const LocalPageValidator = () => {
	const intl = useIntl();
	const tabUrl = useAppSelector(selectTargetTabUrl);
	const name = intl.formatMessage({id: 'LocalPageValidator.name'});

	const handleValidate = () => {
		browser.runtime.sendMessage(validatePage({url: tabUrl}));
	};

	if (isFirefox()) {
		return (
			<HelperButton
				name={name}
				title={intl.formatMessage({
					id: 'LocalPageValidator.firefoxUnavailable'
				})}
				disabled
			/>
		);
	}

	return <HelperButton name={name} onClick={handleValidate} />;
};

export default LocalPageValidator;
