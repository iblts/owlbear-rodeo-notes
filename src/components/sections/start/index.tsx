import { Button } from '@/components/ui/button'
import { IconLogo } from '@/components/ui/icons/Logo'
import { IconQuestion } from '@/components/ui/icons/Question'
import { useDice } from '@/hooks/useDice'
import { useCurrentSection } from '@/store/useCurrentSection'
import styles from './start-section.module.scss'

export const StartSection = () => {
	const setCurrentSection = useCurrentSection(state => state.setCurrentSection)
	const handleRollDice = useDice()

	return (
		<section className={styles.section}>
			<IconLogo />
			<h1 className={styles.title}>{'Не выбирай,\nпока не сможешь выбрать'}</h1>
			<Button onClick={() => handleRollDice('2d20kh1+5')} variant='secondary'>
				D20
			</Button>
			<article className={styles.info}>
				<p className={styles.text}>
					Когда игра начнется, свайпай вправо или влево, чтобы выбрать свой
					любимый город — в конце тебя будет ждать промокод
				</p>
				<div className={styles.actions}>
					<Button
						className={styles.startButton}
						onClick={() => setCurrentSection('cards')}
					>
						Начать
					</Button>
					<Button variant='circle' className={styles.helpButton}>
						<IconQuestion />
					</Button>
				</div>
			</article>
			<div className={styles.floor} />
		</section>
	)
}
