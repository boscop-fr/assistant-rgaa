import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Page = ({id, title, children}) => (
	<div
		className={classNames({
			Page: true,
			[`Page--${id}`]: !!id
		})}
	>
		<h1 className="Page-title Title">{title}</h1>

		<div className="Page-body">{children}</div>
	</div>
);

Page.propTypes = {
	id: PropTypes.string,
	title: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired
};

Page.defaultProps = {
	id: ''
};

export default Page;
