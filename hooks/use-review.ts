import { create } from 'zustand'

interface IZustentReview {
	isOpen: boolean
	isLoading: boolean
	onOpen: () => void
	onClose: () => void
	startLoading: () => void
	endLoading: () => void
}
export const useReview = create<IZustentReview>(set => ({
	isOpen: false,
	isLoading: false,

	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	startLoading: () => set({ isLoading: true }),
	endLoading: () => set({ isLoading: false }),
}))
