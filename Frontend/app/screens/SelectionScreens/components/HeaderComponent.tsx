import { FC } from "react"
import { translate } from "../../../i18n"
import { useNavigation } from "@react-navigation/native"
import { TextInput, View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing } from "app/theme"
import { ProgressBarComponent } from "./ProgressBarComponent"
import { Icon } from "app/components"
// ... existing imports ...

interface HeaderComponentProps {
  title: string
  searchQuery: string
  progressValue: number
  progressExist: boolean
  onSearchChange: (text: string) => void
  currentStep: number
}

export const HeaderComponent: FC<HeaderComponentProps> = ({
  title,
  searchQuery,
  progressValue,
  progressExist,
  onSearchChange,
  currentStep,
}) => {
  const navigation = useNavigation()

  return (
    <View style={$header}>
      <View style={$headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon icon="back" size={20} color={colors.palette.neutral800} />
        </TouchableOpacity>
        <View style={$headerTextContainer}>
          <Text style={$headerText}>{title}</Text>
        </View>
      </View>
      <View style={$stepContainer}>
        <Text style={$stepText}>
          {translate("selectionScreens.stepFormat", { current: currentStep, total: 5 })}
        </Text>
      </View>
      <ProgressBarComponent progressValue={progressValue} />
      <View style={$searchContainer}>
        <Icon icon="search" size={20} color={colors.palette.neutral500} />
        <TextInput
          style={$searchInput}
          placeholder={translate("selectionScreens.searchPlaceholder")}
          placeholderTextColor={colors.palette.neutral500}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  )
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
  backgroundColor: colors.background,
}

const $stepContainer: ViewStyle = {
  marginVertical: 8,
}

const $stepText: TextStyle = {
  fontSize: 14,
  color: colors.palette.neutral500,
}

const $searchContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  paddingHorizontal: 12,
  marginTop: 8,
}

const $searchInput: TextStyle = {
  flex: 1,
  marginLeft: 8,
  paddingVertical: 8,
  fontSize: 16,
  color: colors.text,
}

const $headerTextContainer: ViewStyle = {
  alignItems: "center",
  flex: 1,
}

const $headerRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 15,
  marginHorizontal: spacing.lg,
}

const $headerText: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  marginLeft: 15,
  color: colors.palette.neutral800,
}
