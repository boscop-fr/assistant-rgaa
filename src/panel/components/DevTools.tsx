import React from 'react';
import {selectVersion, setVersion} from '../slices/reference';
import {useAppDispatch, useAppSelector} from '../utils/hooks';

const DevTools = () => {
	const version = useAppSelector(selectVersion);
	const dispatch = useAppDispatch();

	return (
		<div
			className="DevTools"
			style={{
				display: 'flex'
			}}
		>
			<input
				placeholder="critère"
				type="search"
				onChange={(event) => {
					const id = event.target.value;
					const criterion = document.querySelector(
						`.Criterion[data-id="${id}"]`
					);

					if (criterion) {
						criterion.scrollIntoView(true);
					}
				}}
				style={{
					flex: '1'
				}}
			/>

			<button
				type="button"
				onClick={() => {
					dispatch(setVersion(version));
				}}
			>
				Recharger le référentiel
			</button>
		</div>
	);
};

export default DevTools;
