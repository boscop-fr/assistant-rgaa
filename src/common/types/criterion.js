import PropTypes from 'prop-types';

export const CriterionProps = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	level: PropTypes.string.isRequired
};

export const CriterionShape = PropTypes.shape(CriterionProps);
