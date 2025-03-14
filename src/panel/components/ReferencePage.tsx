import debounce from 'debounce';
import React, {useCallback, useRef} from 'react';
import {selectAllThemes, selectIsLoaded} from '../slices/reference';
import {saveScrollPosition, selectScrollPosition} from '../slices/themes';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Theme from './Theme';

const ReferencePage = () => {
	const isReferenceLoaded = useAppSelector(selectIsLoaded);
	const scrollPosition = useAppSelector(selectScrollPosition);
	const initialScrollPosition = useRef(scrollPosition);
	const themes = useAppSelector(selectAllThemes);
	const dispatch = useAppDispatch();

	const handleScroll = debounce((event) => {
		dispatch(saveScrollPosition(event.target.scrollTop));
	}, 500);

	const themesRef = useCallback((node: HTMLDivElement) => {
		if (node !== null && initialScrollPosition.current) {
			node.scrollTop = initialScrollPosition.current;
		}
	}, []);

	if (!isReferenceLoaded) {
		return null;
	}

	return (
		<div className="ReferencePage" onScroll={handleScroll} ref={themesRef}>
			{Object.values(themes).map((theme) => (
				<Theme key={theme.id} theme={theme} />
			))}
		</div>
	);
};

export default ReferencePage;
