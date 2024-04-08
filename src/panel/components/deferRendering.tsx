import hoistStatics from 'hoist-non-react-statics';
import React, {Component, ComponentType} from 'react';

// Allows two animation frames to complete to allow other
// components to update and re-render before mounting and
// rendering an expensive `WrappedComponent`.
// @see https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3#b1f2
export default function deferRendering(WrappedComponent: ComponentType) {
	type DeferredRenderWrapperProps = {};
	type DeferredRenderWrapperState = {
		shouldRender: boolean;
	};

	class DeferredRenderWrapper extends Component<
		DeferredRenderWrapperProps,
		DeferredRenderWrapperState
	> {
		state: DeferredRenderWrapperState = {
			shouldRender: false
		};

		componentDidMount() {
			window.requestAnimationFrame(() => {
				window.requestAnimationFrame(() =>
					this.setState({
						shouldRender: true
					})
				);
			});
		}

		render() {
			return this.state.shouldRender ? (
				<WrappedComponent {...this.props} />
			) : null;
		}
	}

	return hoistStatics(DeferredRenderWrapper, WrappedComponent);
}
