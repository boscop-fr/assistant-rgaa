import {applyMiddleware, createStore as createReduxStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

/**
 *
 */
export default function createStore(reducer, saga, initialState = {}) {
	const sagaMiddleware = createSagaMiddleware();
	const store = createReduxStore(
		reducer,
		initialState,
		applyMiddleware(sagaMiddleware)
	);

	if (saga) {
		sagaMiddleware.run(saga);
	}

	return store;
}
