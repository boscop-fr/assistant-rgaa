import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';
import {getAllCriteriaByTheme} from '../../common/selectors/reference';
import {ThemeShape} from '../../common/types/theme';
import CriterionContainer from './CriterionContainer';

/**
 *
 */
function Theme({theme}) {
	const criteria = useSelector((state) =>
		getAllCriteriaByTheme(state, theme.id)
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
					<CriterionContainer key={criterion.id} {...criterion} />
				))}
			</ul>
		</div>
	);
}

Theme.propTypes = {
	theme: ThemeShape.isRequired
};

export default Theme;
