import {connect} from 'react-redux';
import {areStylesEnabled} from '../../common/selectors/styles';
import StylesToggle from './StylesToggle';
import {toggleStyles} from '../../common/actions/styles';

/**
 *
 */
const mapStateToProps = (state) => ({
	areStylesEnabled: areStylesEnabled(state)
});

/**
 *
 */
const mapDispatchToProps = (dispatch) => ({
	toggleStyles(enabled) {
		dispatch(toggleStyles(enabled));
	}
});

/**
 *
 */
export default connect(mapStateToProps, mapDispatchToProps)(StylesToggle);
