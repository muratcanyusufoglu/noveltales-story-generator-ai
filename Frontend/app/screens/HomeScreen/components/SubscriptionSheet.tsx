import React, { useState, useEffect } from "react"
import { Alert, Platform } from "react-native"
import { Sheet, XStack, YStack, Text, Button, Card } from "tamagui"
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases"
import { colors } from "app/theme"
import { translate } from "app/i18n"

interface SubscriptionSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionSheet({ isOpen, onClose }: SubscriptionSheetProps) {
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  // ... keep all the existing useEffect, handleSelectPackage, and getPurchase functions ...

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
      {/* ... rest of your existing Sheet content ... */}
    </Sheet>
  )
}
