import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, Text } from "../components"
import { translate } from "../i18n"
import { DiscoverStoriesScreen } from "../screens/DiscoverStoriesScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { HomeScreen } from "app/screens/HomeScreen/Screens/HomeScreen"
import { CharacterSelectionScreen } from "app/screens/SelectionScreens/screens/SelectCharacterScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TimeSelectionScreen } from "app/screens/SelectionScreens/screens/TimeSelectionScreen"
import { LocationSelectionScreen } from "app/screens/SelectionScreens/screens/LocationSelectionScreen"
import { TopicSelectionScreen } from "app/screens/SelectionScreens/screens/TopicSelectionScreen"
import { ContentSelectionScreen } from "app/screens/SelectionScreens/screens/ContentSelectionScreen"
import { SummarySelectionScreen } from "app/screens/SelectionScreens/screens/SummarySelectionScreen"
import { StoryDetailScreen } from "app/screens/HomeScreen/Screens/StoryDetailScreen"
import { useAuthenticationStore } from "app/store"
import { DemoDebugScreen } from "app/screens/DemoDebugScreen"

const { height } = Dimensions.get("window")

export type DemoTabParamList = {
  HomeScreenNavigator: undefined
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DiscoverScreen: {
    selectedCategory?: string
    categoryId?: number
  }
  CharacterSelectionScreen: undefined
  TimeSelectionScreen: undefined
  LocationSelectionScreen: undefined
  TopicSelectionScreen: undefined
  ContentSelectionScreen: undefined
  SummarySelectionScreen: undefined
  DiscoverStoriesScreen: undefined
  StoryDetailScreen: {
    story: {
      id: number
      imageUrl: string
      header: string
      contentText: string
      generatedContent: string
      storyImage: string
      isContinues: boolean
      isEditable: boolean
    }
  }
  HomeScreen: undefined
  SubscriptionScreen: undefined
  WelcomeScreen: undefined
}

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

const SelectScreensStack = createNativeStackNavigator<DemoTabParamList>()
const HomeScreensStack = createNativeStackNavigator<DemoTabParamList>()
const DiscoverScreensStack = createNativeStackNavigator<DemoTabParamList>()

const HomeScreensNavigator = () => {
  const { isSubscribed, creditBalance, authEmail } = useAuthenticationStore()

  return (
    <HomeScreensStack.Navigator>
      <HomeScreensStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerLeft: () => (
            <Text style={$headerRight}>
              {translate("homeScreen.welcome")} {authEmail}
            </Text>
          ),
          headerTitle: "",
          headerStyle: { backgroundColor: colors.background },
          headerRight: () =>
            isSubscribed ? (
              <Icon icon="crownPremium" color={colors.palette.accent400} size={40} />
            ) : (
              <Icon icon="crown" size={40} />
            ),
        }}
      />
      <HomeScreensStack.Screen
        name="StoryDetailScreen"
        component={StoryDetailScreen}
        options={{ headerBackTitleVisible: false }}
      />
    </HomeScreensStack.Navigator>
  )
}

const SelectScreenNavigator = () => {
  return (
    <SelectScreensStack.Navigator screenOptions={{ headerShown: false }}>
      <SelectScreensStack.Screen
        name="CharacterSelectionScreen"
        component={CharacterSelectionScreen}
      />
      <SelectScreensStack.Screen name="TimeSelectionScreen" component={TimeSelectionScreen} />
      <SelectScreensStack.Screen
        name="LocationSelectionScreen"
        component={LocationSelectionScreen}
      />
      <SelectScreensStack.Screen name="TopicSelectionScreen" component={TopicSelectionScreen} />
      <SelectScreensStack.Screen name="ContentSelectionScreen" component={ContentSelectionScreen} />
      <SelectScreensStack.Screen name="SummarySelectionScreen" component={SummarySelectionScreen} />
      <SelectScreensStack.Screen
        name="StoryDetailScreen"
        component={StoryDetailScreen}
        options={{ headerBackTitleVisible: false, headerShown: true }}
      />
    </SelectScreensStack.Navigator>
  )
}

const DiscoverScreenNavigator = () => {
  const { isSubscribed, authEmail } = useAuthenticationStore()

  return (
    <DiscoverScreensStack.Navigator>
      <DiscoverScreensStack.Screen
        name="DiscoverScreen"
        component={DiscoverStoriesScreen}
        options={{
          headerShown: true,
          headerLeft: () => (
            <Text style={$headerRight}>
              {translate("homeScreen.welcome")} {authEmail}
            </Text>
          ),
          headerTitle: "",
          headerStyle: { backgroundColor: colors.background },
          headerRight: () =>
            isSubscribed ? (
              <Icon icon="crownPremium" color={colors.palette.accent400} size={40} />
            ) : (
              <Icon icon="crown" size={40} />
            ),
        }}
      />
      <DiscoverScreensStack.Screen
        name="StoryDetailScreen"
        component={StoryDetailScreen}
        options={{ headerBackTitleVisible: false }}
      />
    </DiscoverScreensStack.Navigator>
  )
}

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()

  const unselectedColor = colors.palette.neutral800

  const TextComponent = ({ focused, text }: { focused: boolean; text: string }) => (
    <Text style={focused ? selectedTextStyle : unselectedTextStyle}>{text}</Text>
  )

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar],
        tabBarActiveTintColor: colors.palette.neutral800,
        tabBarInactiveTintColor: colors.palette.neutral800,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeScreenNavigator"
        component={HomeScreensNavigator}
        options={{
          tabBarLabel: ({ focused }) => (
            <TextComponent focused={focused} text={translate("navigator.home")} />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? unselectedColor : colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="CharacterSelectionScreen"
        component={SelectScreenNavigator}
        options={{
          tabBarLabel: ({ focused }) => (
            <TextComponent focused={focused} text={translate("navigator.create")} />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon="createBook" color={focused ? unselectedColor : colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DiscoverScreen"
        component={DiscoverScreenNavigator}
        options={{
          tabBarAccessibilityLabel: translate("navigator.discover"),
          tabBarLabel: ({ focused }) => (
            <TextComponent focused={focused} text={translate("navigator.discover")} />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon="discoverBook" color={focused ? unselectedColor : colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TextComponent focused={focused} text={translate("navigator.myStories")} />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon="myStories" color={focused ? unselectedColor : colors.tint} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.palette.neutral200,
  height: height * 0.11,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.xs,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.palette.neutral800,
}

const $headerRight: TextStyle = {
  marginRight: spacing.sm,
  color: colors.text,
  fontFamily: typography.primary.medium,
}

const selectedTextStyle: TextStyle = {
  fontSize: 12,
  alignItems: "center",
  color: "black",
}

const unselectedTextStyle: TextStyle = {
  fontSize: 12,
  alignItems: "center",
  color: colors.tint,
}
