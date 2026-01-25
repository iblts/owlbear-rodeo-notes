import cn from 'clsx'
import React from 'react'
import styles from './SwipeButton.module.scss'

import type { CardViewType, CardViewVariantType } from '@/utils/types.ts'
interface SwipeButtonInterface {
	variant: CardViewVariantType
	cardView: CardViewType
	onClick: () => void
	className?: string
}

const SwipeButton: React.FC<SwipeButtonInterface> = ({
	variant,
	cardView,
	onClick,
	className,
}) => {
	const icon = {
		wishList: 'Вишлист',
		stopList: 'Стоплист',
		next: 'Дальше',
	}

	const isDisabled = cardView !== 'default' && variant !== 'next'

	return (
		<button
			className={cn(styles.button, className)}
			data-variant={variant}
			onClick={onClick}
			type={'button'}
			disabled={isDisabled}
		>
			{icon[variant]}
		</button>
	)
}

export { SwipeButton }
