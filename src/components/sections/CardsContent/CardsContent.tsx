'use client'

import React, { useEffect, useRef, useState } from 'react'

import cn from 'clsx'
import styles from './CardsContent.module.scss'

import { useWindowSize } from '@/hooks/useWindowSize'
import { useCardStore } from '@/store/useCardStore'
import { useCurrentSection } from '@/store/useCurrentSection'
import { useSelectedCitiesStore } from '@/store/useSelectedCitiesStore'
import type {
	CardViewType,
	SwipeDirectionType,
	TimeoutType,
} from '@/utils/types'
import { cardsData } from '../../../data/cardsData'
import { Card } from './elements'

export interface CardsContentInterface {
	isAnimationStarted: boolean
	isFinalSection: boolean
	showNextSection: () => void
}

const CardsContent: React.FC<CardsContentInterface> = ({
	isAnimationStarted,
	showNextSection,
	isFinalSection,
}) => {
	const { width } = useWindowSize()

	//# стейты карточек
	const [cardView, setCardView] = useState<CardViewType>('default') // стейт для хранения внешнего вида карточки
	const currentCardIndex = useCardStore(state => state.currentCardIndex)
	const setCurrentCardIndex = useCardStore(state => state.setCurrentCardIndex)
	const setCardsCount = useCardStore(state => state.setCardsCount)

	const [isNextCard, setIsNextCard] = useState(false) // флаг для определения перехода на следующую карточку
	const [isFinal, setIsFinal] = useState(false) // флаг для определения поведения для финальной карточки
	const timeoutRef = useRef<TimeoutType | null>(null) // ссылка на таймаут для карточек

	//# стейты для свайпа
	const [swipeDirection, setSwipeDirection] =
		useState<SwipeDirectionType | null>(null) // стейт для хранения направления свайпа
	const [initialSwipeDirection, setInitialSwipeDirection] =
		useState<SwipeDirectionType | null>(null) // стейт для хранения начального направления свайпа
	const [startX, setStartX] = useState<number | null>(null) // стейт для хранения начальной позиции свайпа
	const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 }) // стейт для хранения позиции перетаскивания карточки
	const [isDragging, setIsDragging] = useState(false) // флаг для определения перетаскивания мышкой
	const [isSwipeProcessing, setIsSwipeProcessing] = useState(false) // флаг для обработки свайпа
	const [isSwipeAnimating, setIsSwipeAnimating] = useState(false) // флаг для определения анимации реакции на свайп на мобильных устройствах

	const SWIPE_THRESHOLD = 10 //! пороговое значение для свайпа (мышь и тач)

	const currentSection = useCurrentSection(state => state.currentSection)
	const isChangeSection = useCurrentSection(state => state.isChangeSection)

	//# счетчик "стоплиста"
	const selectCity = useSelectedCitiesStore(state => state.selectCity) // функция для увеличения счетчика "стоплиста"

	//* ОЧИСТКА ТАЙМЕРА *//
	//# Функция для очистки таймера
	const clearTimeoutRef = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
	}

	//* КНОПКИ *//
	//# функция для перехода к следующей карточке
	const handleNextCard = () => {
		clearTimeoutRef() // очистка таймера

		setIsNextCard(true)

		// если не последняя карточка, то переходим к следующей карточке
		if (currentCardIndex < cardsData.length - 3) {
			timeoutRef.current = setTimeout(() => {
				setCurrentCardIndex(currentCardIndex + 1)
				setCardView('default')
				setSwipeDirection(null)
				setIsSwipeAnimating(false)
				setInitialSwipeDirection(null)
				setIsNextCard(false)
				setIsSwipeAnimating(false)
			}, 320)
		} else {
			// если последняя карточка, то переходим к следующему экрану (-3 потому что последние две карточки это болванки и они не учитываются)
			setIsFinal(true)
			timeoutRef.current = setTimeout(() => {
				showNextSection()
			}, 100)
		}
	}

	//# функция для переключения информации о карточке в рамках одной карточки
	const handleShowCardInfo = (
		targetView: CardViewType,
		direction: SwipeDirectionType
	) => {
		clearTimeoutRef() // очистка таймера

		// Сохраняем начальное направление только при переходе из default состояния
		if (cardView === 'default') {
			setInitialSwipeDirection(direction)
		}

		setSwipeDirection(direction)

		// если нажата кнопка "стоп" и карточка не в режиме "стоп", то увеличиваем счетчик для подсчета финального результата
		// if (targetView === 'stopList' && cardView !== 'stopList') {
		// 	setStopListCounter()
		// }

		if (cardView === targetView) {
			timeoutRef.current = setTimeout(() => {
				handleNextCard()
			}, 100) // Даем время на анимацию перед сменой карточки
		} else {
			timeoutRef.current = setTimeout(() => {
				setCardView(targetView)
			}, 200) // Даем время на анимацию перед сменой карточки
		}
	}

	//* СВАЙП *//
	//# функция для обработки свайпа (мышь и тач)
	const handleSwipeAction = (direction: SwipeDirectionType) => {
		if (isSwipeProcessing) return
		setIsSwipeProcessing(true)

		setSwipeDirection(direction)
		if (direction === 'right') selectCity(currentCardIndex + 1)
		// const targetView = direction === 'left' ? 'stopList' : 'wishList'

		// if (cardView === 'default') {
		// 	setIsSwipeAnimating(true)
		// 	handleShowCardInfo(targetView, direction)
		// } else {
		handleNextCard()
		// }
	}

	//# очистка таймера для свайпа
	useEffect(() => {
		if (!isSwipeProcessing) return
		const timer = setTimeout(() => setIsSwipeProcessing(false), 300)
		return () => clearTimeout(timer)
	}, [isSwipeProcessing])

	//# Общий обработчик начала взаимодействия (мышь и тач)
	const handleInteractionStart = (
		event: React.MouseEvent | React.TouchEvent
	) => {
		if (isSwipeProcessing) return

		const clientX =
			'touches' in event ? event.touches[0].clientX : event.clientX

		setStartX(clientX)
		setIsDragging(true)
	}

	//# Общий обработчик окончания взаимодействия (мышь и тач)
	const handleInteractionEnd = (event: React.MouseEvent | React.TouchEvent) => {
		if (startX === null || isSwipeProcessing || !isDragging) return

		const endX =
			'changedTouches' in event
				? event.changedTouches[0].clientX
				: event.clientX

		const deltaX = endX - startX

		if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
			handleSwipeAction(deltaX > 0 ? 'right' : 'left')
		}

		// Сбрасываем позицию
		setDragPosition({ x: 0, y: 0 })
		setStartX(null)
		setIsDragging(false)
	}

	//# функция для обработки перетаскивания карточки (мышь и тач)
	const handleInteractionMove = (
		event: React.MouseEvent | React.TouchEvent
	) => {
		if (!isDragging || !startX) return

		const currentX =
			'touches' in event ? event.touches[0].clientX : event.clientX
		const deltaX = currentX - startX

		// Ограничиваем движение карточки
		const maxDrag = 60
		const boundedDeltaX = Math.max(Math.min(deltaX, maxDrag), -maxDrag)
		console.log('Перетаскивание карточки:', boundedDeltaX)

		setDragPosition({
			x: boundedDeltaX,
			y: Math.abs(boundedDeltaX) * 0.05, // Небольшой наклон
		})
	}

	//# очистка таймера
	useEffect(() => {
		return () => {
			clearTimeoutRef()
		}
	}, [])

	useEffect(() => {
		setCardsCount(cardsData.length - 2) // -2 потому что последние две карточки это болванки и они не учитываются
	}, [setCardsCount])

	//# обработка нажатий клавиш стрелок для управления карточками
	useEffect(() => {
		// если не в секции с карточками, то не выполняем функцию
		if (currentSection !== 'cards' || width < 1024) return
		if (
			isSwipeProcessing ||
			isNextCard ||
			isSwipeAnimating ||
			currentCardIndex > cardsData.length - 2
		)
			return // Избегаем двойного вызова во время анимации или показа подсказки
		let timeoutId: TimeoutType | null = null // Переменная для хранения таймера

		let isBlocked = false // Флаг для блокировки

		const handleKeyPress = (event: KeyboardEvent) => {
			if (isBlocked) return // Если флаг блокировки установлен, то не выполняем функцию

			isBlocked = true // Блокируем дальнейшие нажатия

			if (event.key === 'ArrowLeft') {
				handleShowCardInfo(
					cardView === 'default' ? 'stopList' : cardView,
					'left'
				)
			} else if (event.key === 'ArrowRight') {
				handleShowCardInfo(
					cardView === 'default' ? 'wishList' : cardView,
					'right'
				)
			}

			timeoutId = setTimeout(() => (isBlocked = false), 2000) // Разблокируем через 300 мс
		}

		window.addEventListener('keydown', handleKeyPress)

		return () => {
			window.removeEventListener('keydown', handleKeyPress)
			if (timeoutId) clearTimeout(timeoutId) // Очищаем таймер при размонтировании
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		cardView,
		currentCardIndex,
		currentSection,
		isNextCard,
		isSwipeAnimating,
		isSwipeProcessing,
		width,
	])

	return (
		<div
			className={cn(styles.cardsContent, styles.showCardsAnimation, {
				[styles.showCardsAnimation__hideContainer]: !isAnimationStarted,
				/* анимация для финального экрана */
				[styles.showCardsAnimation__finalContainer_left]:
					isFinal && swipeDirection === 'left',
				[styles.showCardsAnimation__finalContainer_right]:
					isFinal && swipeDirection === 'right',
				[styles.animationCards__invisible]:
					isFinal && currentSection === 'final' && isFinalSection,
			})}
		>
			{/* слайдер с карточками */}
			<div
				className={styles.cardsTrack}
				onTouchStart={handleInteractionStart}
				onTouchEnd={handleInteractionEnd}
				onMouseDown={handleInteractionStart}
				onMouseUp={handleInteractionEnd}
				onMouseLeave={handleInteractionEnd}
				onMouseMove={handleInteractionMove}
				onTouchMove={handleInteractionMove}
			>
				{cardsData.map((card, index) => {
					const isCurrentCard = index === currentCardIndex
					const isLastCard = index === cardsData.length - 1
					const isOneBeforeLastCard = index === cardsData.length - 2

					return (
						<div
							key={card.id}
							className={cn(styles.cardWrapper, styles.animationCards, {
								/* стиль для скрытия карточек */
								[styles.animationCards__invisible]: currentCardIndex > index,
								/* анимация для смахивания карточки */
								[styles.animationCards__swipe_left]:
									!isFinal &&
									isNextCard &&
									isCurrentCard &&
									swipeDirection === 'left',
								[styles.animationCards__swipe_right]:
									!isFinal &&
									isNextCard &&
									isCurrentCard &&
									swipeDirection === 'right',
							})}
							style={{
								...(isCurrentCard && isDragging
									? {
											transform: `translate(${dragPosition.x}px, ${
												dragPosition.y
											}px) rotate(${dragPosition.x * 0.05}deg)`,
											transition: 'none',
									  }
									: {}),
								zIndex: 10 + cardsData.length - index,
							}}
						>
							<Card
								cardData={card}
								className={cn(styles.animationCards, {
									/* анимация для смены вида карточки */
									[styles.cardWrapper_last]:
										isAnimationStarted &&
										!isChangeSection &&
										currentSection === 'cards' &&
										isLastCard,
									[styles.cardWrapper_oneBeforeLast]:
										isAnimationStarted &&
										!isChangeSection &&
										currentSection === 'cards' &&
										isOneBeforeLastCard,
									[styles.animationCards__toList_left]:
										isCurrentCard && initialSwipeDirection === 'left',
									[styles.animationCards__toList_right]:
										isCurrentCard && initialSwipeDirection === 'right',
								})}
								variant={isCurrentCard ? cardView : 'default'}
							/>
						</div>
					)
				})}
			</div>
			{/* кнопки для переключения представления карточки */}
			{/* <div
				className={cn(styles.buttons, styles.showCardsAnimation, {
					[styles.showCardsAnimation__showButtons]:
						isAnimationStarted && currentSection !== 'main',
					[styles.showCardsAnimation__showButtonsInSwipe_left]:
						isSwipeAnimating && initialSwipeDirection === 'left',
					[styles.showCardsAnimation__showButtonsInSwipe_right]:
						isSwipeAnimating && initialSwipeDirection === 'right',
				})}
			>
				<SwipeButton
					cardView={cardView}
					variant={
						width > 560
							? cardView === 'stopList'
								? 'next'
								: 'stopList'
							: 'stopList'
					}
					onClick={() => handleShowCardInfo('stopList', 'left')}
				/>
				<SwipeButton
					cardView={cardView}
					variant={
						width > 560
							? cardView === 'wishList'
								? 'next'
								: 'wishList'
							: 'wishList'
					}
					onClick={() => handleShowCardInfo('wishList', 'right')}
				/>
			</div> */}
		</div>
	)
}

export { CardsContent }
