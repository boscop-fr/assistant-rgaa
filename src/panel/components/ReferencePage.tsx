import debounce from 'debounce';
import React, {useCallback} from 'react';
import {selectAllThemes, selectIsLoaded} from '../slices/reference';
import {saveScrollPosition, selectScrollPosition} from '../slices/themes';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import EnabledTests from './EnabledTests';
import Theme from './Theme';

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
			<div
				className="ReferencePage-themes"
				onScroll={handleScroll}
				ref={themesRef}
			>
				{Object.values(themes).map((theme) => (
					<Theme key={theme.id} theme={theme} />
				))}
			</div>

			<div className="ReferencePage-enabledTests">
				<EnabledTests />
			</div>
		</div>
	);
};

export default ReferencePage;
