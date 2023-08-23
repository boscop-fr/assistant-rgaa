import PropTypes from 'prop-types';

export const ThemeProps = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export const ThemeShape = PropTypes.shape(ThemeProps);
