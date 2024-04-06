import React from 'react';
import {useSelector} from 'react-redux';
import {isFirefox} from '../../common/utils/browser';
import {sendMessage} from '../../common/utils/runtime';
import {selectPageUrl} from '../../panel/slices/panel';
import {validatePage} from '../../background/slices/runtime';
import HelperButton from './HelperButton';

const LocalPageValidator = () => {
	const tabUrl = useSelector(selectPageUrl);

	const handleValidate = () => {
		sendMessage(validatePage({url: tabUrl}));
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
		<HelperButton
			name="Validateur W3C (HTML local)"
			onClick={handleValidate}
		/>
	);
};

export default LocalPageValidator;
