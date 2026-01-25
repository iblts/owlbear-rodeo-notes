import { Button } from '@/components/ui/button'
import { IconQuestion } from '@/components/ui/icons/Question'
import { cardsData } from '@/data/cardsData'
import { useSelectedCitiesStore } from '@/store/useSelectedCitiesStore'
import { useState } from 'react'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './select-city-section.module.scss'

export const SelectCitySection = () => {
	const selectedCities = useSelectedCitiesStore(state => state.selectedCities)
	const cities = cardsData.filter(card => selectedCities.includes(card.id))
	const [currentSlide, setCurrentSlide] = useState(0)
	console.log(cities)

	return (
		<section className={styles.section}>
			<h1 className={styles.title}>А вот и ваши города!</h1>
			<p className={styles.subtitle}>
				Кликайте на тот, который понравился больше всего, а мы подарим промокод
			</p>
			<Swiper
				spaceBetween={40}
				centeredSlides
				slidesPerView={'auto'}
				onSlideChange={swiper => setCurrentSlide(swiper.activeIndex)}
				className={styles.swiper}
				wrapperTag='ul'
				loop
			>
				{cities.map((card, index) => (
					<SwiperSlide key={index} tag='li' className={styles.slide}>
						<div
							className={styles.card}
							style={{
								transform: `rotate(${index % 2 === 0 ? '' : '-'}${2}deg)`,
							}}
						>
							{card.image && <img src={card.image} />}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className={styles.info}>
				<h2 className={styles.title}>{cities[currentSlide].title}</h2>
				<div className={styles.counter}>
					<span>{currentSlide + 1}</span>
					<span>/</span>
					<span>{cities.length}</span>
				</div>
				<Button variant='circle-secondary' className={styles.helpButton}>
					<IconQuestion fill='#0D41D2' />
				</Button>
			</div>
		</section>
	)
}
