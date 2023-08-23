import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import {map, noop, debounce} from 'lodash';
import {ThemeShape} from '../../common/types/theme';
import ThemesListContainer from './ThemesListContainer';
import DevToolsContainer from './DevToolsContainer';
import ThemeContainer from './ThemeContainer';
import StylesToggleContainer from './StylesToggleContainer';

/**
 *
 */
export default class ReferencePage extends Component {
	constructor(props) {
		super(props);
		this.bindThemes = this.bindThemes.bind(this);
		this.onScroll = debounce(this.props.onScroll, 500);
	}

	componentDidMount() {
		if (!this.themesElement) {
			return;
		}

		if (this.props.initialScrollPosition) {
			this.themesElement.scrollTop = this.props.initialScrollPosition;
		}

		this.themesElement.addEventListener('scroll', this.onScroll, false);
	}

	componentWillUnmount() {
		if (!this.themesElement) {
			return;
		}

		this.themesElement.removeEventListener('scroll', this.onScroll, false);
	}

	bindThemes(domElement) {
		this.themesElement = domElement;
	}

	render() {
		return (
			<div className="ReferencePage">
				{renderIf(process.env.NODE_ENV !== 'production')(() => (
					<DevToolsContainer />
				))}
				<div className="ReferencePage-actions">
					<ThemesListContainer />
					<StylesToggleContainer />
				</div>
				<div ref={this.bindThemes} className="ReferencePage-themes">
					{map(this.props.themes, (theme, n) => (
						<ThemeContainer key={n} theme={theme} />
					))}
				</div>
			</div>
		);
	}
}

ReferencePage.propTypes = {
	themes: PropTypes.arrayOf(ThemeShape).isRequired,
	initialScrollPosition: PropTypes.number.isRequired,
	onScroll: PropTypes.func
};

ReferencePage.defaultProps = {
	onScroll: noop
};
