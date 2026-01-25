import type { CardViewType } from '@/utils/types'
import cn from 'clsx'
import React from 'react'
import styles from './CardContainer.module.scss'

interface CardContainerInterface {
	type?: 'mainCard' | 'backgroundCard'
	variant: CardViewType
	children?: React.ReactNode
	className?: string
}

const CardContainer: React.FC<CardContainerInterface> = ({
	type = 'mainCard',
	variant,
	children,
	className,
}) => {
	return (
		<div
			className={cn(
				styles.cardContainer,
				styles[`cardContainer__${type}`],
				styles[`cardContainer_${variant}`],
				className,
			)}
		>
			{children}
		</div>
	)
}

export { CardContainer }
