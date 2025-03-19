import React, {useEffect, useRef, useState} from 'react';
import {addAppListener} from '../middlewares/listener';
import {selectAllThemes} from '../slices/reference';
import {stateLoaded} from '../slices/storage';
import {saveScrollPosition, selectScrollPosition} from '../slices/themes';
import {useAppDispatch, useAppSelector, useDebounce} from '../utils/hooks';
import Theme from './Theme';

const ReferencePage = () => {
	const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
	const debouncedScrollPosition = useDebounce(currentScrollPosition, 300);
	const themes = useAppSelector(selectAllThemes);
	const dispatch = useAppDispatch();
	const themesRef = useRef<HTMLDivElement>();

	useEffect(
		() =>
			dispatch(
				addAppListener({
					actionCreator: stateLoaded,
					effect: (action, api) => {
						if (themesRef.current) {
							const position = selectScrollPosition(api.getState());
							themesRef.current.scrollTop = position;
						}
					}
				})
			),
		[dispatch]
	);

	useEffect(() => {
		dispatch(saveScrollPosition(debouncedScrollPosition));
	}, [dispatch, debouncedScrollPosition]);

	return (
		<div
			ref={themesRef}
			className="ReferencePage"
			onScroll={(event) => {
				setCurrentScrollPosition((event.target as HTMLElement).scrollTop);
			}}
		>
			{Object.values(themes).map((theme) => (
				<Theme key={theme.id} theme={theme} />
			))}
		</div>
	);
};

export default ReferencePage;
