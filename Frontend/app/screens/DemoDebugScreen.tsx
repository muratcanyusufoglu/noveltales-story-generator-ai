import React, { FC } from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, TouchableOpacity } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { useAuthenticationStore } from "app/store"
import { translate } from "app/i18n"

export const DemoDebugScreen: FC<DemoTabScreenProps<"DemoDebug">> = function DemoDebugScreen(
  _props,
) {
  const { authEmail, isSubscribed, creditBalance, logout } = useAuthenticationStore()

  return (
    <SafeAreaView style={$container}>
      <Screen preset="scroll">
        {/* Header Section */}
        <View style={$headerRow}>
          <TouchableOpacity onPress={() => _props.navigation.goBack()}>
            <Icon icon="back" size={20} color={colors.palette.neutral800} />
          </TouchableOpacity>
          <View style={$headerTextContainer}>
            <Text style={$headerText}>{translate("demoDebugScreen.myProfile")}</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={$profileSection}>
          <View style={$profileImageContainer}>{/* Add profile image here */}</View>
          <View style={$profileInfo}>
            <Text style={$profileName}>{authEmail}</Text>
            <Text style={$subscriptionStatus}>
              {isSubscribed
                ? translate("demoDebugScreen.subscribed")
                : translate("demoDebugScreen.notSubscribed")}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={$infoSection}>
          <View style={$infoRow}>
            <Text style={$infoLabel}>{translate("demoDebugScreen.username")}</Text>
            <Text style={$infoValue}>{authEmail}</Text>
          </View>
          <View style={$infoRow}>
            <Text style={$infoLabel}>{translate("demoDebugScreen.creditBalance")}</Text>
            <Text style={$infoValue}>{creditBalance}</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={$buttonSection}>
          <Button
            text={translate("demoDebugScreen.editProfile")}
            style={$editProfileButton}
            textStyle={$editProfileButtonText}
            onPress={() => console.log("Edit Profile pressed")}
          />
          <Button
            text={translate("demoDebugScreen.subscriptionSettings")}
            style={$subscriptionButton}
            textStyle={$subscriptionButtonText}
            onPress={() => _props.navigation.navigate("SubscriptionScreen")}
          />
          <Button
            text={translate("demoDebugScreen.logout")}
            style={$logoutButton}
            textStyle={$logoutButtonText}
            onPress={logout}
          />
        </View>
      </Screen>
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
  height: 72,
}

const $title: TextStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontSize: 18,
  fontWeight: "700",
  color: "#1C170D",
  textAlign: "center",
}

const $profileSection: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  marginHorizontal: spacing.lg,
}

const $profileImageContainer: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 20,
  backgroundColor: "#E5E7EB",
  marginRight: 16,
  alignItems: "center",
}

const $profileInfo: ViewStyle = {
  flex: 1,
}

const $profileName: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#1C170D",
}

const $subscriptionStatus: TextStyle = {
  fontSize: 14,
  color: "#6B7280",
}

const $infoSection: ViewStyle = {
  marginHorizontal: spacing.lg,
}

const $infoRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
}

const $infoLabel: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#1C170D",
}

const $infoValue: TextStyle = {
  fontSize: 16,
  color: "#1C170D",
}

const $buttonSection: ViewStyle = {
  marginTop: 16,
}

const $editProfileButton: ViewStyle = {
  marginBottom: spacing.md,
  backgroundColor: colors.appPrimary,
  borderRadius: spacing.md,
  marginHorizontal: spacing.lg,
  borderWidth: 0,
}

const $editProfileButtonText: TextStyle = {
  color: "white",
  fontWeight: "bold",
}

const $subscriptionButton: ViewStyle = {
  marginBottom: spacing.md,
  backgroundColor: colors.inputBackground,
  borderRadius: spacing.md,
  marginHorizontal: spacing.lg,
  borderWidth: 0,
}

const $subscriptionButtonText: TextStyle = {
  color: colors.text,
  fontWeight: "bold",
}

const $logoutButton: ViewStyle = {
  borderWidth: 0,
  backgroundColor: colors.transparent,
}

const $logoutButtonText: TextStyle = {
  color: colors.text,
  fontWeight: "bold",
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
