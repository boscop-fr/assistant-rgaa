import PropTypes from 'prop-types';
import React from 'react';
import {useSelector} from 'react-redux';
import {createTab} from '../../common/slices/runtime';
import {sendMessage} from '../../common/api/runtime';
import {selectPageUrl} from '../../common/slices/panel';
import HelperButton from './HelperButton';

const ExternalTool = ({name, url}) => {
	const tabUrl = useSelector(selectPageUrl);

	const handleCreateTab = () => {
		const interpolated = url.replace(':url', tabUrl);

		sendMessage(
			createTab({
				url: interpolated
			})
		);
	};

	return <HelperButton name={name} onClick={handleCreateTab} />;
};

ExternalTool.propTypes = {
	url: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};

export default ExternalTool;
