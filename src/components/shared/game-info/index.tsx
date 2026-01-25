import { Hint } from '@/components/ui/hint'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useCardStore } from '@/store/useCardStore'
import styles from './game-info.module.scss'

export const GameInfo = () => {
	const currentCard = useCardStore(state => state.currentCardIndex)
	const cardsCount = useCardStore(state => state.cardsCount)

	return (
		<article className={styles.gameInfo}>
			<section className={styles.upper}>
				<div className={styles.text}>
					<p className={styles.count}>
						{currentCard + 1} / {cardsCount}
					</p>
					<p className={styles.subtitle}>городов</p>
				</div>
				<Hint />
			</section>
			<ProgressBar current={currentCard} total={cardsCount} />
		</article>
	)
}
