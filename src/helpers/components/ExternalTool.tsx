import React from 'react';
import {createTab} from '../../background/slices/runtime';
import {selectPageUrl} from '../../panel/slices/panel';
import {useAppSelector} from '../../panel/utils/hooks';
import HelperButton from './HelperButton';

type ExternalToolProps = {
	url: string;
	name: string;
};

const ExternalTool = ({name, url}: ExternalToolProps) => {
	const tabUrl = useAppSelector(selectPageUrl);

	const handleCreateTab = () => {
		const interpolated = url.replace(':url', tabUrl);

		browser.runtime.sendMessage(
			createTab({
				url: interpolated
			})
		);
	};

	return <HelperButton name={name} onClick={handleCreateTab} />;
};

export default ExternalTool;
