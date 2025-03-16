import {useEffect, useState} from 'preact/hooks';
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

// @see https://usehooks.com/usedebounce
export const useDebounce = <T>(value: T, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};
