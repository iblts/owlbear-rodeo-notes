'use client';

import { useState, useEffect } from 'react';

interface WindowSize {
	width: number;
	height: number;
}

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const updateSize = () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			setWindowSize({ width: newWidth, height: newHeight });

			// Обновляем CSS-переменную --window-height
			document.documentElement.style.setProperty('--window-height', `${newHeight * 0.01}px`);
		};

		// Обновляем при первой загрузке
		updateSize();

		const handleResize = () => {
			requestAnimationFrame(updateSize); // Используем requestAnimationFrame для плавного обновления
		};

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
}
