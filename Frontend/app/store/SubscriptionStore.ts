import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"

export interface SubscriptionStore {
  isSheetOpen: boolean
  isPremium: boolean
  currentPlan: string | null
  // Add any other subscription-related state you need

  // Actions
  openSheet: () => void
  closeSheet: () => void
  setPremiumStatus: (value: boolean) => void
  setCurrentPlan: (value: string | null) => void
}

export const createSubscriptionSlice: StateCreator<RootStore, [], [], SubscriptionStore> = (
  set,
) => ({
  isSheetOpen: false,
  isPremium: false,
  currentPlan: null,

  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  setPremiumStatus: (value) => set({ isPremium: value }),
  setCurrentPlan: (value) => set({ currentPlan: value }),
})

export const subscriptionStoreSelector = (state: RootStore) => ({
  isSheetOpen: state.isSheetOpen,
  isPremium: state.isPremium,
  currentPlan: state.currentPlan,
  openSheet: state.openSheet,
  closeSheet: state.closeSheet,
  setPremiumStatus: state.setPremiumStatus,
  setCurrentPlan: state.setCurrentPlan,
})
