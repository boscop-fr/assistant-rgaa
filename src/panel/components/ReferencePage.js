import {debounce, map} from 'lodash';
import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import renderIf from 'render-if';
import {saveScrollPosition} from '../../common/actions/themes';
import {getAllThemes, isLoaded} from '../../common/selectors/reference';
import {getScrollPosition} from '../../common/selectors/themes';
import DevToolsContainer from './DevToolsContainer';
import StylesToggleContainer from './StylesToggleContainer';
import Theme from './Theme';
import ThemesListContainer from './ThemesListContainer';
import deferRendering from './deferRendering';

/**
 *
 */
const ReferencePage = () => {
	const isReferenceLoaded = useSelector(isLoaded);
	const initialScrollPosition = useSelector(getScrollPosition);
	const themes = useSelector(getAllThemes);
	const dispatch = useDispatch();

	const handleScroll = debounce((event) => {
		dispatch(saveScrollPosition(event.target.scrollTop));
	}, 500);

	const themesRef = useCallback((node) => {
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
			{renderIf(process.env.NODE_ENV !== 'production')(() => (
				<DevToolsContainer />
			))}

			<div className="ReferencePage-actions">
				<ThemesListContainer />
				<StylesToggleContainer />
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
