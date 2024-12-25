import React, { useState, useEffect } from "react"
import { Alert, Platform, Linking, ViewStyle, TextStyle, Dimensions, View } from "react-native"
import { Sheet, XStack, YStack, Text, Button, Card } from "tamagui"
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases"
import { colors, spacing } from "app/theme"
import { translate } from "app/i18n"
import { useAuthenticationStore } from "app/store"

interface SubscriptionSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionSheet({ isOpen, onClose }: SubscriptionSheetProps) {
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const { isSubscribed, setIsSubscribed } = useAuthenticationStore()

  useEffect(() => {
    if (isOpen) {
      setIsSubscribed(false)
      const setupPurchases = async () => {
        try {
          const apiKey =
            Platform.OS === "android"
              ? "your_revenuecat_google_api_key"
              : "appl_JFINcEojlYXnTWrrYqTAGtvjFVR"
          await Purchases.configure({ apiKey })
          Purchases.setDebugLogsEnabled(true)

          const customerInfo = await Purchases.getCustomerInfo()
          console.log("customerInfo", customerInfo)
          const proAccess = customerInfo.entitlements.active["Pro Access"]
          const isPremium = proAccess?.isActive ?? false
          setHasActiveSubscription(isPremium)
          setIsSubscribed(isPremium)

          console.log("proAccess, ", proAccess, ":: ", isPremium)

          if (!isPremium) {
            const offerings = await Purchases.getOfferings()
            setCurrentOffering(offerings?.current || null)
          }
        } catch (error) {
          console.error("Error fetching subscription info:", error)
          Alert.alert("Error", "Unable to fetch subscription information. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
      setupPurchases()
    }
  }, [isOpen])

  const handleSelectPackage = (pkg: PurchasesPackage) => {
    setSelectedPackage(pkg.identifier) // Highlight the selected package
  }

  const getPurchase = async (pkg: PurchasesPackage) => {
    setIsSubscribed(false)
    try {
      if (Platform.OS === "ios") {
        // Check if user is logged into App Store
        const appStoreAvailable = await Purchases.isConfigured()
        // Additional check for active App Store account
        try {
          await Purchases.syncPurchases()
        } catch (syncError) {
          Alert.alert(
            translate("subscription.alerts.appStoreRequired.title"),
            translate("subscription.alerts.appStoreRequired.message"),
            [
              {
                text: translate("subscription.alerts.appStoreRequired.openSettings"),
                onPress: () => Linking.openURL("app-settings:"),
              },
              { text: translate("subscription.alerts.appStoreRequired.cancel") },
            ],
          )
          return
        }

        if (!appStoreAvailable) {
          Alert.alert(
            "App Store Account Required",
            "Please sign in to your App Store account to make purchases.",
            [{ text: "OK" }],
          )
          return
        }
      }

      // Rest of the purchase logic
      const { customerInfo } = await Purchases.purchasePackage(pkg)

      console.log("customerInfo", customerInfo)
      if (typeof customerInfo.entitlements.active.premium !== "undefined") {
        Alert.alert("Success", "Purchase completed successfully!")
        setIsSubscribed(true)
        onClose()
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error("Purchase error:", error)
        Alert.alert(
          "Purchase Error",
          "Please make sure you're signed in to your App Store account and try again.",
        )
      }
    }
  }

  const handleRestore = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases()
      if (typeof customerInfo.entitlements.active.premium !== "undefined") {
        setHasActiveSubscription(true)
        Alert.alert("Success", "Your subscription has been restored!")
        onClose
      } else {
        Alert.alert("No Subscription Found", "No active subscription was found to restore.")
      }
    } catch (error) {
      console.error("Restore error:", error)
      Alert.alert("Error", "Failed to restore purchases. Please try again.")
    }
  }

  if (hasActiveSubscription) {
    return (
      <Sheet
        modal
        open={isOpen}
        onOpenChange={onClose}
        zIndex={100_000}
        dismissOnSnapToBottom={true}
        dismissOnOverlayPress={true}
        animation="medium"
        snapPoints={[90]}
      >
        <Sheet.Overlay
          backgroundColor="transparent" // Removes dimming effect
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          padding="$4"
          justifyContent="center"
          style={{ borderTopEndRadius: 30, borderTopStartRadius: 30, backgroundColor: "#1e1e1e" }}
        >
          <YStack space="$4" alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="white" textAlign="center">
              {translate("purchase.activeSubscription")}
            </Text>
            <Text fontSize="$4" color="$gray10" textAlign="center">
              {translate("purchase.alreadySubscribed")}
            </Text>
            <Button backgroundColor="#9fc4c2" borderRadius="$10" size="$5" onPress={onClose}>
              <Text fontSize="$4" fontWeight="bold" color="black">
                {translate("common.close")}
              </Text>
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    )
  }

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      zIndex={100_000}
      dismissOnSnapToBottom={true}
      dismissOnOverlayPress={true}
      animation="medium"
      snapPoints={[90]}
    >
      <Sheet.Overlay
        backgroundColor="transparent"
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        padding="$4"
        style={{
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          backgroundColor: "#1e1e1e",
          height: "90%",
        }}
      >
        {/* Header */}
        <Button
          style={$headerButton}
          textProps={{ style: $headerText }}
          size="$2"
          onPress={onClose}
          backgroundColor="transparent"
        >
          {translate("subscription.done")}
        </Button>

        {/* Title */}
        <Text style={$title} textAlign="center">
          {translate("purchase.readyForBetterStories")}
        </Text>

        {/* Features */}
        <YStack space="$4" marginBottom="$8">
          <XStack alignItems="center" space="$4">
            <Text style={$featureIcon}>🔲</Text>
            <Text style={$featureText}>{translate("purchase.writeStoriesLikeAPro")}</Text>
          </XStack>
          <XStack alignItems="center" space="$4">
            <Text style={$featureIcon}>🔔</Text>
            <Text style={$featureText}>{translate("purchase.unlockYourCreativity")}</Text>
          </XStack>
          <XStack alignItems="center" space="$4">
            <Text style={$featureIcon}>🚫</Text>
            <Text style={$featureText}>{translate("purchase.pureStorytellingExperience")}</Text>
          </XStack>
        </YStack>

        {/* Subscription Cards */}
        <XStack space="$4" justifyContent="center" alignItems="center" marginBottom="$10">
          {currentOffering?.availablePackages.map((pkg) => (
            <View style={{ width: "35%" }}>
              {pkg.identifier === "$rc_annual" && (
                <YStack
                  space="$0"
                  alignItems="center"
                  style={{
                    backgroundColor: colors.palette.neutral500,
                    borderTopLeftRadius: spacing.lg,
                    borderTopRightRadius: spacing.lg,
                    padding: 10,
                    width: "100%",
                    height: Dimensions.get("window").height * 0.06,
                    borderWidth: pkg.identifier === selectedPackage ? 0 : 1,
                    borderColor: colors.palette.neutral100,
                  }}
                >
                  <Text fontSize="$3" color={"white"} textAlign="center" numberOfLines={2}>
                    {translate("subscription.freeTrial")}
                  </Text>
                </YStack>
              )}
              <Card
                key={pkg.identifier}
                borderRadius="$10"
                style={[
                  $subscriptionCard,
                  {
                    backgroundColor:
                      pkg.identifier === selectedPackage
                        ? "#9fc4c2"
                        : pkg.identifier === "$rc_lifetime"
                        ? "#9fc4c2"
                        : "transparent",
                    borderTopLeftRadius: pkg.identifier === "$rc_annual" ? 0 : spacing.lg,
                    borderTopRightRadius: pkg.identifier === "$rc_annual" ? 0 : spacing.lg,
                    borderWidth: pkg.identifier === selectedPackage ? 0 : 1,

                    height:
                      pkg.identifier === "$rc_annual"
                        ? Dimensions.get("window").height * 0.15
                        : Dimensions.get("window").height * 0.2,
                  },
                ]}
                onPress={() => handleSelectPackage(pkg)}
              >
                <YStack space="$1" alignItems="center" justifyContent="center" height="100%">
                  <Text
                    style={[
                      $periodText,
                      {
                        color:
                          pkg.identifier === selectedPackage || pkg.identifier === "$rc_lifetime"
                            ? "black"
                            : "white",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {pkg.product.title}
                  </Text>
                  <Text
                    style={[
                      $priceText,
                      {
                        color:
                          pkg.identifier === selectedPackage || pkg.identifier === "$rc_lifetime"
                            ? "black"
                            : "white",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {pkg.product.priceString}
                  </Text>

                  {pkg.identifier === "$rc_annual" && (
                    <Text
                      fontSize="$3"
                      color={pkg.identifier === selectedPackage ? "black" : "white"}
                      textAlign="center"
                      numberOfLines={1}
                      position="absolute"
                      bottom={0}
                    >
                      {pkg.product.priceString.slice(0, 1)}
                      {(pkg.product.price / 12).toString().slice(0, 4)}
                      {translate("subscription.perMonth")}
                    </Text>
                  )}
                </YStack>
              </Card>
            </View>
          ))}
        </XStack>

        {/* Continue Button */}
        <Button
          style={$continueButton}
          onPress={() => {
            if (!selectedPackage) {
              Alert.alert("Error", "Please select a package!")
              return
            }
            const packageToPurchase = currentOffering?.availablePackages.find(
              (pkg) => pkg.identifier === selectedPackage,
            )
            if (packageToPurchase) {
              getPurchase(packageToPurchase)
            }
          }}
        >
          <Text fontSize="$4" fontWeight="bold" color="black">
            {translate("purchase.startYourJourney")}
          </Text>
        </Button>

        {/* Footer */}
        <XStack justifyContent="space-between">
          <Text style={$footerText} textDecorationLine="underline" onPress={handleRestore}>
            {translate("subscription.restore")}
          </Text>
          <Text style={$footerText} textDecorationLine="underline">
            {translate("subscription.termsAndConditions")}
          </Text>
          <Text style={$footerText} textDecorationLine="underline">
            {translate("subscription.privacyPolicy")}
          </Text>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  )
}

// Add these styles at the top of the component
const $headerButton: ViewStyle = {
  position: "absolute",
  top: 20,
  left: 20,
  zIndex: 1,
}

const $headerText: TextStyle = {
  fontSize: 14,
  color: "white",
}

const $title: TextStyle = {
  fontSize: 40,
  color: "white",
  fontWeight: "bold",
  marginTop: 60,
  marginBottom: 40,
}

const $featureIcon: TextStyle = {
  color: "#9fc4c2",
  fontSize: 24,
}

const $featureText: TextStyle = {
  color: "white",
  fontSize: 18,
  flex: 1,
}

const $subscriptionCard: ViewStyle = {
  borderRadius: spacing.lg,
  padding: 10,
  height: Dimensions.get("window").height * 0.2,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
}

const $priceText: TextStyle = {
  fontSize: 25,
  fontWeight: "bold",
}

const $periodText: TextStyle = {
  fontSize: 16,
  marginTop: 0,
}

const $continueButton: ViewStyle = {
  backgroundColor: "#9fc4c2",
  borderRadius: spacing.lg,
  height: 50,
  width: "100%",
  marginTop: "auto",
  marginBottom: 20,
}

const $footerText: TextStyle = {
  color: "#9fc4c2",
  fontSize: 14,
}
