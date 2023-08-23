import PropTypes from 'prop-types';

export const TestProps = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export const TestShape = PropTypes.shape(TestProps);
