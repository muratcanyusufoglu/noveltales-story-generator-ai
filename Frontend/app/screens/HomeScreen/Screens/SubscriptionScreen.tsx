import React, { useState, useEffect } from "react"
import { Alert, Platform, Linking } from "react-native"
import { Sheet, XStack, YStack, Text, Button, Card } from "tamagui"
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases"
import { colors } from "app/theme"
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
            "App Store Sign In Required",
            "Please sign in to your Apple ID in the Settings app before making a purchase.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openURL("app-settings:"),
              },
              { text: "Cancel" },
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
        onClose
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
        <YStack paddingHorizontal="$1" flex={1} justifyContent="center">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
            <Button
              textProps={{ color: colors.palette.neutral100, fontSize: 16, fontWeight: "bold" }}
              size="$3"
              onPress={onClose}
              backgroundColor="transparent"
            >
              Done
            </Button>
          </XStack>

          {/* Title */}
          <Text fontSize="$6" fontWeight="bold" color="white" textAlign="center" marginBottom="$6">
            {translate("purchase.tryNovelTalePremium")}
          </Text>
          {/* Features List */}
          <YStack space="$3" marginBottom="$6">
            <XStack alignItems="center" space="$3">
              <Text>📚</Text>
              <Text fontSize="$5" color="$gray10">
                {translate("purchase.createUnlimitedStories")}
              </Text>
            </XStack>
            <XStack alignItems="center" space="$3">
              <Text>🔔</Text>
              <Text fontSize="$5" color="$gray10">
                {translate("purchase.createOwnInputs")}
              </Text>
            </XStack>
            <XStack alignItems="center" space="$3">
              <Text>🚫</Text>
              <Text fontSize="$5" color="$gray10">
                {translate("purchase.removeAdsAndInteruptions")}
              </Text>
            </XStack>
          </YStack>

          {/* Pricing Options */}
          {isLoading ? (
            <Text color="white" textAlign="center">
              {translate("purchase.loading")}
            </Text>
          ) : (
            <XStack space="$4" justifyContent="center" alignItems="center" marginBottom="$10">
              {currentOffering?.availablePackages.map((pkg) => (
                <Card
                  key={pkg.identifier}
                  bordered
                  elevate
                  width="30%"
                  height={120}
                  backgroundColor={pkg.identifier === selectedPackage ? "#9fc4c2" : "#333"}
                  alignItems="center"
                  justifyContent="center"
                  borderColor={
                    selectedPackage === pkg.identifier ? "transparent" : "white" // Highlight if selected
                  }
                  borderWidth={2} // Thicker border for selected
                  onPress={() => handleSelectPackage(pkg)}
                  borderRadius="$10"
                >
                  <Text
                    fontSize="$4"
                    fontWeight="bold"
                    color={pkg.identifier === selectedPackage ? "black" : "white"}
                  >
                    {pkg.product.title}
                  </Text>
                  <Text
                    fontSize="$4"
                    color={pkg.identifier === selectedPackage ? "black" : "white"}
                  >
                    {pkg.product.priceString}
                  </Text>
                  {pkg.identifier === "Annual" && (
                    <>
                      <Text fontSize="$2" color="$gray10">
                        3 days Free trial
                      </Text>
                      <Text fontSize="$2" color="$gray10">
                        That’s ₺66,66/mo
                      </Text>
                    </>
                  )}
                </Card>
              ))}
            </XStack>
          )}

          {/* Continue Button */}
          <Button
            backgroundColor="#9fc4c2"
            borderRadius="$10"
            size="$5"
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
              {translate("purchase.continue")}
            </Text>
          </Button>

          {/* Footer Links */}
          <XStack justifyContent="space-between" marginTop="$6">
            <Text
              fontSize="$3"
              color="#9fc4c2"
              textDecorationLine="underline"
              onPress={handleRestore}
            >
              Restore
            </Text>
            <Text fontSize="$3" color="#9fc4c2" textDecorationLine="underline">
              Terms & Conditions
            </Text>
            <Text fontSize="$3" color="#9fc4c2" textDecorationLine="underline">
              Privacy Policy
            </Text>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
