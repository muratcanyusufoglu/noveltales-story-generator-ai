import React, { FC, useState } from "react"
import { ScrollView } from "react-native"
import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import Animated from "react-native-reanimated"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { colors } from "app/theme"
import { Sheet, Button, Input, YStack } from "tamagui"
import { Icon, Text } from "app/components"
import HomeService from "../Service/HomeService"
import { translate } from "app/i18n/translate"
import { LoadingAnimation } from "app/components/Loading"
import { useAuthenticationStore, useSubscriptionStore } from "app/store"

interface StoryDetailScreenProps extends DemoTabScreenProps<"StoryDetailScreen"> {}

export const StoryDetailScreen: FC<StoryDetailScreenProps> = (_props) => {
  const { story } = _props.route.params
  const [isOpen, setIsOpen] = useState(false)
  const [editedStory, setEditedStory] = useState({
    header: story.header,
    generatedContent: story.generatedContent,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false) // Track if scroll is at the end
  const { creditBalance, setCreditBalance, isSubscribed, isSubscribedOrExistCreditBalance } =
    useAuthenticationStore()
  const { openSheet } = useSubscriptionStore()

  const homeService = new HomeService()

  // Set navigation options with edit button
  React.useLayoutEffect(() => {
    _props.navigation.setOptions({
      title: editedStory.header,
      headerRight: () => (
        <Icon icon="edit" size={24} color="black" onPress={() => setIsOpen(true)} />
      ),
    })
  }, [_props.navigation, editedStory.header])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await homeService.updateStory({
        id: story.id,
        header: editedStory.header,
        generatedContent: editedStory.generatedContent,
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to update story:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
    const isEndReached = contentOffset.y + 150 > contentSize.height - layoutMeasurement.height + 50 // Buffer for precision
    setIsScrolledToEnd(isEndReached)
  }

  const handleContinueStory = async () => {
    if (!isSubscribedOrExistCreditBalance()) {
      // const options = {
      //   title: translate("alerts.error"),
      //   message: translate("alerts.youHaveNoCreditsPleaseSubscribe"),
      //   preset: "error",
      //   duration: 2,
      //   haptic: "error",
      // }
      // toast(options) // easy to use
      openSheet()
      return
    }
    try {
      setIsLoading(true)
      await homeService
        .continueStory({
          id: story.id,
          generatedContent: editedStory.generatedContent,
        })
        .then((res) => {
          setEditedStory((prev) => ({ ...prev, generatedContent: res.generatedContent }))
          setCreditBalance(creditBalance - 1)
        })
    } catch (error) {
      console.error("Failed to continue story:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <LoadingAnimation visible={isLoading} />}
      <ScrollView
        contentContainerStyle={[
          contentContainer,
          { paddingBottom: isScrolledToEnd ? 120 : 0 }, // Adjust padding dynamically
        ]}
        onScroll={handleScroll}
      >
        <Animated.Image
          source={{
            uri: story.storyImage,
          }}
          style={[image]}
          sharedTransitionTag={story.id.toString()}
        />
        {/* <Text style={header}>{story.header}</Text> */}
        <Text style={content}>{editedStory.generatedContent}</Text>
        {story.isContinues && (
          <Button
            size="$5"
            marginVertical="$4"
            backgroundColor={colors.appSecondary}
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            animation="quick"
            icon={
              <Icon
                icon="createBook"
                size={25}
                color={colors.appPrimary}
                style={{ marginRight: 10 }}
              />
            }
            onPress={() => handleContinueStory()}
          >
            {translate("storyDetailScreen.letStoryContinue")}
          </Button>
        )}
      </ScrollView>

      <Sheet modal open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Overlay />
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <YStack space="$4">
            <Input
              value={editedStory.header}
              onChangeText={(text) => setEditedStory((prev) => ({ ...prev, header: text }))}
              placeholder={translate("storyDetailScreen.storyTitle")}
            />
            <Input
              value={editedStory.generatedContent}
              onChangeText={(text) =>
                setEditedStory((prev) => ({ ...prev, generatedContent: text }))
              }
              placeholder={translate("storyDetailScreen.storyContent")}
              multiline
              numberOfLines={8}
            />
            <Button onPress={handleSave}>{translate("storyDetailScreen.saveChanges")}</Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

// Styles
const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background, // Dark background
}

const image: ImageStyle = {
  width: "100%",
  height: 300,
}

const contentContainer: ViewStyle = {
  paddingHorizontal: 16,
}

const header: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  marginVertical: 12,
}

const content: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  marginVertical: 12,
}
