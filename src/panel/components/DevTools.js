import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectVersion, setVersion} from '../slices/reference';

const DevTools = () => {
	const version = useSelector(selectVersion);
	const dispatch = useDispatch();

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
