import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { persist, createJSONStorage } from "zustand/middleware"

import {
  AuthenticationStore,
  authenticationStoreSelector,
  createAuthenticationSlice,
} from "./AuthenticationStore"
import { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  CreateStoryStore,
  createCreateStorySlice,
  createStoryStoreSelector,
} from "./CreateStoryStore"
import {
  createSubscriptionSlice,
  SubscriptionStore,
  subscriptionStoreSelector,
} from "./SubscriptionStore"

export interface RootStore
  extends AuthenticationStore,
    EpisodeStore,
    CreateStoryStore,
    SubscriptionStore {
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createEpisodeSlice(...a),
      ...createCreateStorySlice(...a),
      ...createSubscriptionSlice(...a),
      _hasHydrated: false,
      setHasHydrated: (state) => {
        const set = a[0]
        set({
          _hasHydrated: state,
        })
      },
    }),
    {
      name: "zustand-app",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector))
export const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector))
export const useCreateStoryStore = () => useStore(useShallow(createStoryStoreSelector))
export const useSubscriptionStore = () => useStore(useShallow(subscriptionStoreSelector))
