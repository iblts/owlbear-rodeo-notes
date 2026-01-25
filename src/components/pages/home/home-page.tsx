import { FinalSection } from '@/components/sections/final'
import { GameInfo } from '@/components/shared/game-info'
// import { useLaunchParams, useRawInitData } from '@tma.js/sdk-react'
import { StartSection } from '@/components/sections/start'
import { useCurrentSection } from '../../../store/useCurrentSection'
import { CardsContent } from '../../sections/CardsContent/CardsContent'
import styles from './home-page.module.scss'

export const HomePage = () => {
	// const initData = useRawInitData()
	// const launchParams = useLaunchParams()
	const setCurrentSection = useCurrentSection(state => state.setCurrentSection)
	const currentSection = useCurrentSection(state => state.currentSection)

	if (currentSection === 'main') {
		return <StartSection />
	}

	if (currentSection === 'final') {
		return <FinalSection />
	}

	return (
		<main className={styles.main}>
			<CardsContent
				showNextSection={() => setCurrentSection('final')}
				isAnimationStarted
				isFinalSection={false}
			/>
			<div className={styles.floor} />
			<GameInfo />
			{/* <BackButton /> */}
		</main>
	)
}
