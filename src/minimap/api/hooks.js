import {debounce} from 'lodash';
import {useEffect} from 'react';

export const useMutationObserver = (callback, delay = 15) => {
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
	}, []);
};

export const useScrollEffect = (callback) => {
	useEffect(() => {
		window.addEventListener('scroll', callback);

		return () => {
			window.removeEventListener('scroll', callback);
		};
	}, []);
};

export const useResizeEffect = (callback, delay = 15) => {
	useEffect(() => {
		const handleResize = debounce(callback, delay);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
};
