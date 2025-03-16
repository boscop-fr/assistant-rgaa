import classNames from 'classnames';
import React from 'react';
import {FormattedMessage} from 'react-intl';

type ColorContrastResultProps = {
	ratio: number;
	minimumRatio: number;
};

const ColorContrastResult = ({
	ratio,
	minimumRatio
}: ColorContrastResultProps) => (
	<p className="ColorContrastResult">
		<FormattedMessage id="ColorContrastResult.ratio" />

		{ratio ? (
			<span className="ColorContrastResult-ratio">
				<span
					className={classNames({
						'ColorContrastResult-actualRatio': true,
						'ColorContrastResult-actualRatio--invalid': ratio < minimumRatio
					})}
				>
					{Number(ratio).toFixed(2)}
				</span>
				<span> / </span>
				<span className="ColorContrastResult-minimumRatio">{minimumRatio}</span>
			</span>
		) : (
			<span className="ColorContrastResult-ratio">
				<FormattedMessage id="ColorContrastResult.invalidResult" />
			</span>
		)}
	</p>
);

export default ColorContrastResult;
