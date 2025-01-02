import React, { FC, useState } from "react"
import { View, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Button, Icon, Text } from "../../../components"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useAuthenticationStore, useCreateStoryStore, useSubscriptionStore } from "app/store"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "app/theme"
import { LoadingAnimation } from "../../../components/Loading"
import { translate } from "app/i18n"
import { toast } from "@baronha/ting"
import SelectService from "../service/SelectService"
import { Switch } from "tamagui"

export const SummarySelectionScreen: FC<DemoTabScreenProps<"SummarySelectionScreen">> = ({
  navigation,
}) => {
  const {
    title,
    characters,
    locations,
    topic,
    content,
    timeContent,
    topicId,
    time,
    contentId,
    locationId,
    resetStore,
  } = useCreateStoryStore()

  const service = new SelectService()
  const [loading, setLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false) // State for switch
  const { isSubscribed, creditBalance, setCreditBalance, isSubscribedOrExistCreditBalance } =
    useAuthenticationStore()
  const { openSheet } = useSubscriptionStore()

  const [switchLabel, setSwitchLabel] = useState(translate("summaryScreen.off")) // State for dynamic label
  const userId = 61

  const createStory = async () => {
    if (!isSubscribedOrExistCreditBalance()) {
      openSheet()
      return
    }

    if (isSubscribed || (!isSubscribed && creditBalance > 0)) {
      setLoading(true)
      try {
        const response = await service.createStory(
          userId,
          characters,
          topicId,
          topic,
          time,
          timeContent,
          contentId,
          content,
          locations,
          locationId,
          isEnabled,
        )

        resetStore()

        const options = {
          title: translate("alerts.done"),
          message: translate("alerts.yourStoryIsReady"),
        }
        toast(options)

        // Reset to home screen first, then navigate to story detail
        navigation.reset({
          index: 0,
          routes: [
            { name: "HomeScreen" },
            { name: "StoryDetailScreen", params: { story: response } },
          ],
        })
        navigation.navigate("StoryDetailScreen", { story: { ...response, isEditable: true } })

        // Decrement credits only for non-subscribed users
        if (!isSubscribed && creditBalance > 0) {
          setCreditBalance(creditBalance - 1)
        }
      } catch (error) {
        const options = {
          title: translate("alerts.error"),
          message: translate("alerts.thereWasAnError"),
        }
        toast(options)
        console.log(error)
      } finally {
        setLoading(false)
      }
    } else {
      const options = {
        title: translate("alerts.done"),
        message: translate("alerts.youHaveNoCreditsPleaseSubscribe"),
      }
      toast(options)
    }
  }

  const toggleSwitch = (checked: boolean) => {
    setIsEnabled(checked)
    setSwitchLabel(checked ? translate("summaryScreen.on") : translate("summaryScreen.off"))
  }

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <View style={$summaryRow}>
      <Text style={$label}>{label}</Text>
      <Text style={$value}>{value}</Text>
    </View>
  )

  return (
    <SafeAreaView style={$container}>
      <LoadingAnimation visible={loading} />

      {/* Header */}
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$iconButton}>
          <Icon icon="back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={$headerTextContainer}>
          <Text style={$headerTitle}>{translate("summaryScreen.title")}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView>
        <View style={$contentContainer}>
          <SummaryRow
            label={translate("summaryScreen.characters")}
            value={
              characters.length > 0
                ? characters.map((c) => c).join(", ")
                : translate("common.notSelected")
            }
          />
          <SummaryRow
            label={translate("summaryScreen.locations")}
            value={locations || translate("common.notSelected")}
          />
          <SummaryRow
            label={translate("summaryScreen.topic")}
            value={topic || translate("common.notSelected")}
          />
          <SummaryRow
            label={translate("summaryScreen.content")}
            value={content || translate("common.notSelected")}
          />
          <SummaryRow
            label={translate("summaryScreen.time")}
            value={timeContent || translate("common.notSelected")}
          />
          <View style={$summaryRow}>
            <Text style={$label}>{translate("selectionScreens.continueStory")}</Text>
            <View style={$switchContainer}>
              <Switch
                size="$4"
                checked={isEnabled}
                onCheckedChange={toggleSwitch}
                backgroundColor={isEnabled ? colors.appPrimary : colors.barBackgroundColor}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
              <Text style={$switchLabel}>{switchLabel}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={$buttonContainer}>
        <Button
          text={translate("summaryScreen.createStory")}
          onPress={createStory}
          style={$createButton}
          textStyle={$buttonText}
        />
        <Button
          text={translate("common.back")}
          onPress={() => navigation.goBack()}
          style={$backButton}
          textStyle={$backButtonText}
        />
      </View>
    </SafeAreaView>
  )
}

const $headerTextContainer: ViewStyle = {
  alignItems: "center",
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 0,
  backgroundColor: colors.background,
}

const $headerTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
  color: colors.text,
}

const $iconButton: ViewStyle = {
  width: 48,
  height: 48,
  justifyContent: "center",
  alignItems: "center",
}

const $contentContainer: ViewStyle = {
  padding: 16,
}

const $summaryRow: ViewStyle = {
  flexDirection: "row",
  paddingVertical: 20,
  borderTopWidth: 1,
  borderTopColor: "#E9DFCE",
}

const $label: TextStyle = {
  flex: 0.3,
  fontSize: 14,
  color: "#A18249",
}

const $value: TextStyle = {
  flex: 0.8,
  fontSize: 14,
  color: colors.text,
  marginLeft: 10,
}

const $buttonContainer: ViewStyle = {
  padding: 16,
  gap: 12,
}

const $createButton: ViewStyle = {
  backgroundColor: "#019863",
  borderRadius: 24,
  height: 48,
}

const $backButton: ViewStyle = {
  backgroundColor: "#F4EFE6",
  borderRadius: 24,
  height: 48,
}

const $buttonText: TextStyle = {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
}

const $backButtonText: TextStyle = {
  color: colors.text,
  fontSize: 16,
  fontWeight: "bold",
}

const $bottomNav: ViewStyle = {
  flexDirection: "row",
  borderTopWidth: 1,
  borderTopColor: "#F4EFE6",
  backgroundColor: colors.background,
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 12,
}

const $navItem: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 4,
}

const $navLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
}

const $switchContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flex: 0.8,
}

const $switchLabel: TextStyle = {
  fontSize: 14,
  fontWeight: "500",
}
