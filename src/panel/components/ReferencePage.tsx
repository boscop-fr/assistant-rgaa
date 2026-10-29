import debounce from 'debounce';
import React, {useEffect, useMemo, useRef} from 'react';
import {addAppListener} from '../middlewares/listener';
import {selectAllThemes} from '../slices/reference';
import {stateLoaded} from '../slices/storage';
import {saveScrollPosition, selectScrollPosition} from '../slices/themes';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import Theme from './Theme';

const ReferencePage = () => {
	const themes = useAppSelector(selectAllThemes);
	const dispatch = useAppDispatch();
	const themesRef = useRef<HTMLDivElement>(null);

	useEffect(
		() =>
			dispatch(
				addAppListener({
					actionCreator: stateLoaded,
					effect: (_action, api) => {
						if (themesRef.current) {
							const position = selectScrollPosition(api.getState());
							themesRef.current.scrollTop = position;
						}
					}
				})
			),
		[dispatch]
	);

	// Not kept in state, which would re-render the whole
	// reference on each scroll event.
	const savePosition = useMemo(
		() =>
			debounce((position: number) => {
				dispatch(saveScrollPosition(position));
			}, 300),
		[dispatch]
	);

	useEffect(() => () => savePosition.clear(), [savePosition]);

	return (
		<div
			ref={themesRef}
			className="ReferencePage"
			onScroll={(event) => {
				savePosition((event.target as HTMLElement).scrollTop);
			}}
		>
			{Object.values(themes).map((theme) => (
				<Theme key={theme.id} theme={theme} />
			))}
		</div>
	);
};

export default ReferencePage;
