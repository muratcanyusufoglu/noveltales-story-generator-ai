import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import { useAuthenticationStore } from "app/store"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  const { setAuthToken } = useAuthenticationStore()
  setAuthToken(61)

  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
