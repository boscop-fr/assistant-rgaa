import React from 'react';
import {useIntl} from 'react-intl';
import {viewPageSource} from '../../../background/slices/runtime';
import {browser} from '../../../common/utils/webExtension';
import {selectTargetTabUrl} from '../../slices/panel';
import {useAppSelector} from '../../utils/hooks';
import HelperButton from './HelperButton';

const ViewSource = () => {
	const intl = useIntl();
	const tabUrl = useAppSelector(selectTargetTabUrl);

	const handleViewSource = () => {
		browser.runtime.sendMessage(viewPageSource({url: tabUrl}));
	};

	return (
		<HelperButton
			name={intl.formatMessage({id: 'ViewSource.name'})}
			onClick={handleViewSource}
		/>
	);
};

export default ViewSource;
