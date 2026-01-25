import { create } from 'zustand'

interface SelectedCitiesInterface {
	selectedCities: number[]
	selectCity: (id: number) => void
}
export const useSelectedCitiesStore = create<SelectedCitiesInterface>(set => ({
	selectedCities: [],
	selectCity: id =>
		set(state => ({
			selectedCities: [...state.selectedCities, id],
		})),
}))
