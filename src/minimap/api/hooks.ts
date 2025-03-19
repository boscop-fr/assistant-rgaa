import debounce from 'debounce';
import {useCallback, useEffect, useRef} from 'react';

export const useAnimationFrame = (callback: () => void) => {
	const id = useRef(0);
	return useCallback(() => {
		cancelAnimationFrame(id.current);
		id.current = requestAnimationFrame(callback);
	}, [callback]);
};

export const useMutationObserver = (callback: () => void) => {
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
	}, [callback]);
};

export const useScrollEffect = (callback: () => void) => {
	useEffect(() => {
		window.addEventListener('scroll', callback);

		return () => {
			window.removeEventListener('scroll', callback);
		};
	}, [callback]);
};

export const useResizeEffect = (callback: () => void, delay = 15) => {
	useEffect(() => {
		const handleResize = debounce(callback, delay);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [callback, delay]);
};
