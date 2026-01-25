import type { SelectedSectionType } from '@/utils/types'
import { create } from 'zustand'

interface CurrentSectionInterface {
	currentSection: SelectedSectionType
	isChangeSection: boolean
	setCurrentSection: (type: SelectedSectionType) => void
	setIsChangeSection: (value: boolean) => void
}

export const useCurrentSection = create<CurrentSectionInterface>(set => ({
	currentSection: 'main',
	isChangeSection: false,
	setCurrentSection: section => set({ currentSection: section }),
	setIsChangeSection: (value: boolean) => set({ isChangeSection: value }),
}))
