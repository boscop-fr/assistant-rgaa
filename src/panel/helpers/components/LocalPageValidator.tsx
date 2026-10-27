import React from 'react';
import {validatePage} from '../../../background/slices/runtime';
import {isFirefox} from '../../../common/utils/browser';
import {browser} from '../../../common/utils/webExtension';
import {selectTargetTabUrl} from '../../slices/panel';
import {useAppSelector} from '../../utils/hooks';
import HelperButton from './HelperButton';

const LocalPageValidator = () => {
	const tabUrl = useAppSelector(selectTargetTabUrl);

	const handleValidate = () => {
		browser.runtime.sendMessage(validatePage({url: tabUrl}));
	};

	if (isFirefox(window.navigator.userAgent)) {
		return (
			<HelperButton
				name="Validateur W3C (HTML local)"
				title="Fonctionnalité à venir sur Firefox"
				disabled
			/>
		);
	}

	return (
		<HelperButton name="Validateur W3C (HTML local)" onClick={handleValidate} />
	);
};

export default LocalPageValidator;
