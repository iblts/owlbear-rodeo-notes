import type { cardsDataInterface } from '@/data/cardsData'
import type { CardViewType } from '@/utils/types'
import cn from 'clsx'
import React from 'react'
import { CardContainer } from '../CardContainer/CardContainer'
import styles from './Card.module.scss'

export interface CardInterface {
	cardData: cardsDataInterface
	variant: CardViewType
	className?: string
}

const Card: React.FC<CardInterface> = ({ cardData, variant, className }) => {
	// вишлист карточка
	const wishListInfo = (
		<>
			<h3 className={cn(styles.title, styles[`title_${variant}`])}>
				В вишлист!
			</h3>
			<div className={cn(styles.content, styles[`content_${variant}`])}>
				<p className={styles.description}>{cardData.wishList.text}</p>
				{cardData.wishList.textSecond && (
					<p className={styles.description}>{cardData.wishList.textSecond}</p>
				)}
			</div>
		</>
	)

	// стоп-лист карточка
	const stopListInfo = (
		<>
			<h3 className={cn(styles.title, styles[`title_${variant}`])}>
				В стоп-лист!
				<span
					className={cn(
						styles.title,
						styles.title_stopList,
						styles.title_stopListAccent,
					)}
				>
					{' '}
					😢
				</span>
			</h3>
			<div className={cn(styles.content, styles[`content_${variant}`])}>
				<p className={styles.description}>
					<span className={cn(styles.description, styles.description_accent)}>
						{cardData.stopList.textCount}
					</span>
					{cardData.stopList.textInfo}
				</p>
				<p className={cn(styles.description, styles.description_decorate)}>
					{cardData.stopList.textDecorate}
				</p>
			</div>
		</>
	)

	return (
		<CardContainer variant={variant} className={className}>
			{cardData.image && (
				<img
					src={cardData.image}
					width={380}
					height={588}
					className={styles.image}
				/>
			)}
			<div className={cn(styles.cardInfo, styles[`cardInfo_${variant}`])}>
				{variant === 'wishList' && wishListInfo}
				{variant === 'stopList' && stopListInfo}
			</div>
		</CardContainer>
	)
}

export { Card }
