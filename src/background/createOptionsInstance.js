import {sendMessage} from '../common/api/runtime';
import createStore from './createStore';

/**
 *
 */
export default function createOptionsInstance() {
	const store = createStore('background-options', sendMessage);

	return {
		sendMessage,
		store,
		dispatch: store.dispatch
	};
}
