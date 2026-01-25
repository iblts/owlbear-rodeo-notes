import { create } from 'zustand'

interface CardStoreInterface {
	currentCardIndex: number
	setCurrentCardIndex: (index: number) => void
	cardsCount: number
	setCardsCount: (count: number) => void
}

export const useCardStore = create<CardStoreInterface>(set => ({
	currentCardIndex: 0,
	setCurrentCardIndex: index => set({ currentCardIndex: index }),
	cardsCount: 0,
	setCardsCount: count => set({ cardsCount: count }),
}))
