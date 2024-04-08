import React from 'react';
import {FormattedMessage} from 'react-intl';
import {type ShallowTheme} from '../../common/types';
import {selectCriteriaByTheme} from '../slices/reference';
import {useAppSelector} from '../utils/hooks';
import Criterion from './Criterion';

type ThemeProps = {
	theme: ShallowTheme;
};

const Theme = ({theme}: ThemeProps) => {
	const criteria = useAppSelector((state) =>
		selectCriteriaByTheme(state, theme.id)
	);

	if (!criteria.length) {
		return null;
	}

	return (
		<div id={`theme-${theme.id}`} className="Theme">
			<div className="Theme-header">
				<h2 className="Theme-title Title">{theme.title}</h2>
				<a href="#themesMenu" className="ScreenReaderOnly Theme-menuLink">
					<FormattedMessage id="Theme.themesMenu" />
				</a>
			</div>

			<ul className="Theme-criteria">
				{criteria.map((criterion) => (
					<Criterion key={criterion.id} {...criterion} />
				))}
			</ul>
		</div>
	);
};

export default Theme;
