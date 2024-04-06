import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {selectCriteriaByTheme} from '../slices/reference';
import Criterion from './Criterion';

const Theme = ({theme}) => {
	const criteria = useSelector((state) =>
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

Theme.propTypes = {
	theme: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}).isRequired
};

export default Theme;
