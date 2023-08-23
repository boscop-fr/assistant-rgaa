import React from 'react';
import classNames from 'classnames';
import {useSelector} from 'react-redux';
import {CONTAINER_ID} from '../api/container';
import ResizeHandle from './ResizeHandle';
import PanelIframe from './PanelIframe';
import {getPosition, isFolded} from '../../common/selectors/panel';

/**
 *
 */
const HandlePosition = {
	right: 'left',
	left: 'right',
	bottom: 'top'
};

/**
 *
 */
export default function App() {
	const position = useSelector(getPosition);
	const folded = useSelector(isFolded);

	return (
		<div
			className={classNames({
				[`${CONTAINER_ID}-wrapper`]: true,
				[`${CONTAINER_ID}-wrapper--${position}`]: true,
				[`${CONTAINER_ID}-wrapper--folded`]: folded
			})}
		>
			<ResizeHandle
				position={HandlePosition[position]}
				enabled={!folded}
				useOverlay
				handleProps={{
					title: 'Redimensionner le panneau'
				}}
			>
				<PanelIframe />
			</ResizeHandle>
		</div>
	);
}
