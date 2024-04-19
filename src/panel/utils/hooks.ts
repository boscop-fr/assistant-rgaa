import {type MutableRefObject, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, AppState} from '../store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

export const useFocusOutEffect = (
	ref: MutableRefObject<HTMLElement>,
	callback: () => void
) => {
	useEffect(() => {
		const handleEvent = ({target}: Event) => {
			if (!ref.current.contains(target as HTMLElement)) {
				callback();
			}
		};

		document.addEventListener('click', handleEvent, true);
		document.addEventListener('focusin', handleEvent, true);

		return () => {
			document.removeEventListener('click', handleEvent);
			document.removeEventListener('focusin', handleEvent);
		};
	}, [ref]);
};

export const useAnchorEvent = (callback: () => void) => {
	window.addEventListener('hashchange', callback);

	return () => {
		window.removeEventListener('hashchange', callback);
	};
};
