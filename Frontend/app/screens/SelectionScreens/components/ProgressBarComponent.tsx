import React, { FC } from "react"
import { View, ViewStyle, Dimensions } from "react-native"
import { Progress, YStack } from "tamagui"
import { colors, spacing } from "app/theme"

const { width } = Dimensions.get("window")

interface ProgressBarComponentProps {
  progressValue: number
}

export const ProgressBarComponent: FC<ProgressBarComponentProps> = ({ progressValue }) => {
  return (
    <View style={$progressWrapper}>
      <YStack style={$progressContainer}>
        <Progress
          size={4}
          value={progressValue}
          caretColor="red"
          outlineColor={"red"}
          backgroundColor={colors.barBackgroundColor}
        >
          <Progress.Indicator
            animation="bouncy"
            caretColor="red"
            backgroundColor={colors.appPrimary}
          />
        </Progress>
      </YStack>
    </View>
  )
}

const $progressWrapper: ViewStyle = {
  marginVertical: spacing.xs,
}

const $progressContainer: ViewStyle = {
  height: 10,
  width: width - 40,
}
