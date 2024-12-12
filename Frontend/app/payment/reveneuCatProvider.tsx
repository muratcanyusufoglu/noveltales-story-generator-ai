import { createContext, useContext, useEffect, useState } from "react"
import { Platform, Alert } from "react-native"
import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases"
import { CustomerInfo } from "react-native-purchases" // Use your RevenueCat API keys
const APIKeys = {
  google: "",
}

interface RevenueCatProps {
  purchasePackage?: (pack: PurchasesPackage) => Promise<boolean>
  restorePermissions?: () => Promise<CustomerInfo>
  user: UserState
  packages: PurchasesPackage[]
  getCustomerInfo?: () => Promise<CustomerInfo>
}

export interface UserState {
  cookies: number
  items: string[]
  pro: boolean
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null)

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps
}

export const RevenueCatProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({
    cookies: 0,
    items: [],
    pro: false,
  })
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android") {
        await Purchases.configure({ apiKey: APIKeys.google })
      } else {
        await Purchases.configure({ apiKey: APIKeys.apple })
      }
      setIsReady(true)

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG)

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info)
      })
      // Load all offerings and the user object with entitlements
      await loadOfferings()
    }
    init()
  }, [])

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings()
    if (offerings.current) {
      setPackages(offerings.current.availablePackages)
    }
  }

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    const activeSubscription = customerInfo.activeSubscriptions[0]
    const exprationDate = customerInfo.latestExpirationDate

    console.log("customerInfo61", exprationDate, " ::  ", activeSubscription)
  }

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pack)
      return true
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert(e)
        return false
      }
    }
  }

  const getCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      console.log("............", customerInfo)
      return customerInfo
      // access latest customerInfo
    } catch (e) {
      // Error fetching customer info
    }
  }

  // // Restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases()
    return customer
  }

  const value = {
    getCustomerInfo,
    restorePermissions,
    user,
    packages,
    purchasePackage,
  }

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>
}
