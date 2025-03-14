import debounce from 'debounce';
import {useEffect} from 'react';

export const useMutationObserver = (callback: () => void, delay = 15) => {
	useEffect(() => {
		const debounced = debounce(callback, delay);
		const observer = new MutationObserver(debounced);

		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true
		});

		return () => {
			observer.disconnect();
		};
	}, [callback, delay]);
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
