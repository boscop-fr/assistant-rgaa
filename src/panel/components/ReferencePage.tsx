import {debounce, map} from 'lodash';
import React, {useCallback} from 'react';
import {selectAllThemes, selectIsLoaded} from '../slices/reference';
import {saveScrollPosition, selectScrollPosition} from '../slices/themes';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import DevTools from './DevTools';
import StylesToggle from './StylesToggle';
import Theme from './Theme';
import ThemesList from './ThemesList';
import deferRendering from './deferRendering';

const ReferencePage = () => {
	const isReferenceLoaded = useAppSelector(selectIsLoaded);
	const initialScrollPosition = useAppSelector(selectScrollPosition);
	const themes = useAppSelector(selectAllThemes);
	const dispatch = useAppDispatch();

	const handleScroll = debounce((event) => {
		dispatch(saveScrollPosition(event.target.scrollTop));
	}, 500);

	const themesRef = useCallback((node: HTMLDivElement) => {
		if (node !== null && initialScrollPosition) {
			// eslint-disable-next-line no-param-reassign
			node.scrollTop = initialScrollPosition;
		}
	}, []);

	if (!isReferenceLoaded) {
		return null;
	}

	return (
		<div className="ReferencePage">
			{process.env.NODE_ENV === 'production' ? null : <DevTools />}

			<div className="ReferencePage-actions">
				<ThemesList />
				<StylesToggle />
			</div>

			<div
				className="ReferencePage-themes"
				onScroll={handleScroll}
				ref={themesRef}
			>
				{map(themes, (theme, n) => (
					<Theme key={n} theme={theme} />
				))}
			</div>
		</div>
	);
};

export default deferRendering(ReferencePage);
