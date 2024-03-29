import {truncate} from 'lodash';
import {connect} from 'react-redux';
import {togglePopup as togglePopupAction} from '../../common/actions/panel';
import {open} from '../../common/actions/options';
import {
	getPageTabId,
	getPageTitle,
	getPopupTabId
} from '../../common/selectors/panel';
import {getVersion} from '../../common/selectors/reference';
import Header from './Header';

/**
 *
 */
const mapStateToProps = (state) => ({
	referenceVersion: getVersion(state),
	inPopup: !!getPopupTabId(state),
	title: truncate(getPageTitle(state), {omission: '…'}),
	tabId: getPageTabId(state)
});

const mapDispatchToProps = (dispatch) => ({
	onOpenOptions() {
		dispatch(open());
	},
	togglePopup(tabId) {
		dispatch(togglePopupAction(tabId));
	}
});

const mergeProps = (props, {togglePopup, ...actions}) => ({
	...props,
	...actions,
	onTogglePopup() {
		togglePopup(props.tabId);
	}
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);
