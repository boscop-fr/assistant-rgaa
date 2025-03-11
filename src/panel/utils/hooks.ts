import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, AppState} from '../store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

export const useAnchorEvent = (callback: () => void) => {
	window.addEventListener('hashchange', callback);

	return () => {
		window.removeEventListener('hashchange', callback);
	};
};
