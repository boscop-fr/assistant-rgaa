import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import {get} from 'lodash';
import createColor from 'color';
import {createMessageHandler, sendMessage} from '../../common/api/runtime';
import {
	REQUEST_PIXEL_COLOR,
	REQUEST_TEXT_COLOR,
	REQUEST_STYLE,
	UPDATE_COLOR,
	UPDATE_STYLE
} from '../actions/colorContrast';
import ColorContrastResult from './ColorContrastResult';
import ToggleButton from './ToggleButton';
import ColorContrastField from './ColorContrastField';

/**
 *	Shape of a color input configuration.
 */
const colorInputConfigShape = PropTypes.shape({
	label: PropTypes.string,
	pixelPicker: PropTypes.bool,
	textPicker: PropTypes.bool
});

/**
 *	Shape of a color input configuration.
 */
const extractorConfigShape = PropTypes.shape({
	label: PropTypes.string,
	left: PropTypes.string,
	right: PropTypes.string
});

/**
 *	This whole thing is VERY obscure.
 *	The communication between the widgets and the page
 *	needs a proper refactoring to be more simple and robust.
 */
class ColorContrastContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			left: '#fff',
			right: '#fff',
			pickRequest: null,
			pickedColor: null
		};

		this.handleMessage = createMessageHandler(this.handleMessage.bind(this));
		this.handleChangeColor = this.handleChangeColor.bind(this);
		this.handlePick = this.handlePick.bind(this);
	}

	componentDidMount() {
		browser.runtime.onMessage.addListener(this.handleMessage);
	}

	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.handleMessage);
	}

	handleMessage({type, payload}) {
		// eslint-disable-next-line default-case
		switch (type) {
			case UPDATE_COLOR:
				this.setState(({pickedColor}) => ({
					[pickedColor]: payload,
					pickRequest: null,
					pickedColor: null
				}));
				break;

			case UPDATE_STYLE:
				this.setState({
					left: get(payload, this.props.extractor.left),
					right: get(payload, this.props.extractor.right),
					pickRequest: null,
					pickedColor: null
				});
				break;
		}
	}

	handleChangeColor(name, value) {
		this.setState({
			[name]: value
		});
	}

	handlePick(pickedColor, pickRequest) {
		this.setState({
			pickedColor,
			pickRequest
		});

		sendMessage({
			type: pickRequest
		});
	}

	get ratio() {
		try {
			const left = createColor(this.state.left);
			const right = createColor(this.state.right);
			const ratio = left.contrast(right);

			return Number(ratio.toFixed(3));
		} catch (e) {
			return 0;
		}
	}

	renderField(name, {label, pixelPicker, textPicker}) {
		const {pickRequest, pickedColor} = this.state;

		return (
			<ColorContrastField
				name={name}
				label={label}
				color={this.state[name]}
				hasPixelPicker={pixelPicker}
				hasTextPicker={textPicker}
				isPickingPixel={
					pickedColor === name && pickRequest === REQUEST_PIXEL_COLOR
				}
				isPickingText={
					pickedColor === name && pickRequest === REQUEST_TEXT_COLOR
				}
				onPickPixel={() => this.handlePick(name, REQUEST_PIXEL_COLOR)}
				onPickText={() => this.handlePick(name, REQUEST_TEXT_COLOR)}
				onChangeColor={(value) => this.handleChangeColor(name, value)}
			/>
		);
	}

	render() {
		const {left, right, extractor, minimumRatio} = this.props;

		return (
			<div className="ColorContrast Widget">
				<form className="Form">
					<div className="Form-row">
						{this.renderField('left', left)}
						{this.renderField('right', right)}
					</div>

					{renderIf(extractor)(() => (
						<ToggleButton
							pressed={this.state.pickRequest === REQUEST_STYLE}
							onClick={() => this.handlePick(null, REQUEST_STYLE)}
						>
							{extractor.label}
						</ToggleButton>
					))}
				</form>

				<ColorContrastResult
					ratio={this.ratio}
					minimumRatio={minimumRatio}
				/>
			</div>
		);
	}
}

ColorContrastContainer.propTypes = {
	left: colorInputConfigShape.isRequired,
	right: colorInputConfigShape.isRequired,
	extractor: extractorConfigShape,
	minimumRatio: PropTypes.number.isRequired
};

ColorContrastContainer.defaultProps = {
	extractor: undefined
};

export default ColorContrastContainer;
