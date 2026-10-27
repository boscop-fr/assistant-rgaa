import {browser} from '../../common/utils/webExtension';
import type {AppStartListening} from '../middlewares/listener';
import {openOptionsPage} from '../slices/options';

export const addOptionsListener = (startListening: AppStartListening) => {
	startListening({
		actionCreator: openOptionsPage,
		effect() {
			browser.runtime.openOptionsPage();
		}
	});
};
