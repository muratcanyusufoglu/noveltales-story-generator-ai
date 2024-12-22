import React, { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button } from "../../../components"
import { colors, spacing } from "app/theme"
import { translate } from "app/i18n"

interface FooterComponentProps {
  onNext: () => void
  onBack: () => void
  isSelectionMade?: boolean
}

export const FooterComponent: FC<FooterComponentProps> = ({
  onNext,
  onBack,
  isSelectionMade = false,
}) => {
  const handleNext = () => {
    if (isSelectionMade) {
      onNext()
    }
  }
  console.log("iseeee", isSelectionMade)

  return (
    <View style={$footer}>
      <Button
        text={translate("common.back")}
        onPress={onBack}
        style={$button}
        textStyle={$buttonText}
      />
      <Button
        text={translate("common.nextStep")}
        textStyle={$buttonNextText}
        onPress={handleNext}
        style={[$buttonNext, { opacity: isSelectionMade ? 1 : 0.5 }]}
        disabled={!isSelectionMade}
      />
    </View>
  )
}

const $footer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  marginBottom: 0,
  paddingHorizontal: spacing.lg,
  width: "100%",
  backgroundColor: "transparent",
}

const $button: ViewStyle = {
  backgroundColor: colors.inputBackground,
  borderRadius: spacing.sm,
  borderWidth: 0,
  paddingHorizontal: spacing.lg,
  opacity: 0.9,
}

const $buttonNext: ViewStyle = {
  backgroundColor: colors.appPrimary,
  borderRadius: spacing.sm,
  borderWidth: 0,
  paddingHorizontal: spacing.md,
}

const $buttonNextText: TextStyle = {
  color: "white",
}

const $buttonText: TextStyle = {
  color: "black",
}
