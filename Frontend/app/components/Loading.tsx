import React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { Text } from "./Text"
import LottieView from "lottie-react-native"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface LoadingAnimationProps {
  visible: boolean
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ visible }) => {
  if (!visible) return null

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/animations/loadingAnimation.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.text} tx="loadingScreen.storyGeneratingPleaseWait" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.95,
    height: width * 0.95,
    marginBottom: -75,
  },
  text: {
    marginTop: 0,
    color: colors.palette.neutral100,
  },
})
