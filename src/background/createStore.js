import {createStore as createReduxStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {
	createGatherMiddleware,
	createBroadcastMiddleware
} from '../common/middlewares/sync';
import reducer from '../common/reducers';
import sagas from './sagas';

/**
 *
 */
export default function createStore(name, sendMessage) {
	const sagaMiddleware = createSagaMiddleware();
	const store = createReduxStore(
		reducer,
		compose(
			applyMiddleware(
				createGatherMiddleware(name),
				sagaMiddleware,
				createBroadcastMiddleware(name, sendMessage)
			)
		)
	);

	sagaMiddleware.run(sagas);
	return store;
}
