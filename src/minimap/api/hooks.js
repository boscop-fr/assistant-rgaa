import {debounce, throttle} from 'lodash';
import {useCallback, useEffect, useState} from 'react';

export const useDebouncedEffect = (callback, deps, delay = 50) => {
	const safeCallback = useCallback(debounce(callback, delay));
	useEffect(safeCallback, deps);
};

export const useHelperElements = () => {
	const [helpers, setHelpers] = useState([]);
	const update = () => {
		setHelpers(document.querySelectorAll('.rgaaExt-Helper'));
	};

	return [helpers, update];
};

export const useMutationObserver = (callback) => {
	useEffect(() => {
		const observer = new MutationObserver(callback);

		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true
		});

		return () => {
			observer.disconnect();
		};
	}, []);
};

export const useScrollEffect = (callback, delay = 50) => {
	useEffect(() => {
		const handleScroll = throttle(callback, delay, {
			leading: true,
			trailing: true
		});

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
};

export const useResizeEffect = (callback, delay = 100) => {
	useEffect(() => {
		const handleResize = debounce(callback, delay);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
};
