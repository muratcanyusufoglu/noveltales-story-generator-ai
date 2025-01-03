import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"

export interface AuthenticationStore {
  authToken?: number
  authEmail: string
  isSubscribed: boolean
  creditBalance: number
  username: string
  setIsSubscribed: (value: boolean) => void
  setAuthToken: (value?: number) => void
  setAuthEmail: (value: string) => void
  setCreditBalance: (value: number) => void
  setUsername: (value: string) => void
  logout: () => void
  isSubscribedOrExistCreditBalance: () => boolean
}

export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (
  set,
  get,
) => ({
  authToken: undefined,
  authEmail: "",
  isSubscribed: false,
  creditBalance: 0,
  username: "",
  setIsSubscribed: (value) => set({ isSubscribed: value }),
  setCreditBalance: (value) => set({ creditBalance: value }),
  setAuthToken: (value) => set({ authToken: value }),
  setAuthEmail: (value) => set({ authEmail: value.replace(/ /g, "") }),
  setUsername: (value) => set({ username: value }),
  logout: () =>
    set({
      authToken: undefined,
      authEmail: "",
      isSubscribed: false,
      creditBalance: 0,
      username: "",
    }),
  isSubscribedOrExistCreditBalance: () => {
    const { isSubscribed, creditBalance } = get()
    console.log("isSubscribed :: ", isSubscribed)
    console.log("creditBalance :: ", creditBalance)
    return isSubscribed || creditBalance + 15 > 0
  },
})

export const authenticationStoreSelector = (state: RootStore) => ({
  authToken: state.authToken,
  authEmail: state.authEmail,
  isSubscribed: state.isSubscribed,
  creditBalance: state.creditBalance,
  username: state.username,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setAuthEmail: state.setAuthEmail,
  setIsSubscribed: state.setIsSubscribed,
  setCreditBalance: state.setCreditBalance,
  setUsername: state.setUsername,
  logout: state.logout,
  isSubscribedOrExistCreditBalance: state.isSubscribedOrExistCreditBalance,
})

export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken

export const validationErrorSelector = (state: RootStore) => {
  if (state.authEmail.length === 0) return "can't be blank"
  if (state.authEmail.length < 6) return "must be at least 6 characters"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authEmail)) return "must be a valid email address"
  return ""
}
