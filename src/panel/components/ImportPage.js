import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import renderIf from 'render-if';
import {resetImports, selectIsActive} from '../../common/slices/imports';
import ImportForm from './ImportForm';
import Page from './Page';

const ImportPage = () => {
	const isImportActive = useSelector(selectIsActive);
	const dispatch = useDispatch();

	return (
		<Page title={<FormattedMessage id="Import.title" />}>
			{renderIf(!isImportActive)(() => (
				<ImportForm />
			))}

			{renderIf(isImportActive)(() => (
				<button
					type="button"
					onClick={() => {
						dispatch(resetImports);
					}}
					className="ImportPage-singleResetButton"
				>
					<FormattedMessage id="Import.singleReset" />
				</button>
			))}
		</Page>
	);
};

export default ImportPage;
