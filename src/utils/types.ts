export type SelectedSectionType = 'main' | 'cards' | 'final' // типы секций
export type CardViewType = 'default' | 'stopList' | 'wishList' // типы видов карточек
export type CardViewVariantType = 'stopList' | 'wishList' | 'next' // типы видов кнопок
export type SwipeDirectionType = 'left' | 'right' // типы направлений свайпа
export type ResultType = { result: 'chaotic' | 'neutral' | 'lawful' } // типы результатов
export type PopupType = 'participate' | 'prizes' | null
export type TimeoutType = ReturnType<typeof setTimeout>

export interface CityCardInterface {
	id: number
	name: string
	image: string | null
	video: string | null
	promocode: string
}
