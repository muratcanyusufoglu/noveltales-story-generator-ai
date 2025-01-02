import React, { FC, useEffect, useState } from "react"
import { View, FlatList, Dimensions, StyleProp } from "react-native"
import { Text, Button } from "../../../components"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ViewStyle, TextStyle } from "react-native"
import HomeService from "../Service/HomeService"
import { useAuthenticationStore } from "app/store"
import Animated from "react-native-reanimated"
import { colors, spacing } from "app/theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { Spacer } from "tamagui"
import { CategoryCard } from "app/components/CategoryComponent"
import { Story } from "app/store/Story"

interface StoryListItem {
  id: number
  userId: number
  characterIds: number[]
  characterNames: string[]
  topicId: number
  topicName: string
  timeLapse: string
  timeLapseTime: string
  content: string
  contentText: string
  locationId: number
  location: string
  generatedContent: string
  header: string
  storyImage: string
  isContinues: boolean
  totalPartCount: number
  createdAt: string
  updatedAt: string
  isEditable?: boolean
}

interface PaginatedStories {
  stories: StoryListItem[]
  currentPage: number
  totalPages: number
  totalItems: number
}

interface Topic {
  id: number
  title: string
  images: string[]
}

// Pre-configure FastImage for all images
FastImage.preload([
  {
    uri: "your-static-image-url-1",
    priority: FastImage.priority.high,
  },
  // Add more static images here
])

// Inspiration of the Day Component
const InspirationOfTheDay: FC<{ todayTopic: any; handleInspiration: () => void }> = ({
  todayTopic,
  handleInspiration,
}) => {
  return (
    <View style={todayTopicCard}>
      <FastImage source={{ uri: todayTopic.imageUrl }} style={todayTopicImage} />
      <View style={todayTopicContent}>
        <Text style={todayTopicTitle}>{todayTopic.topicName}</Text>
        <Text style={todayTopicDescription}>{todayTopic.description}</Text>
        <Button
          text="Get Inspired"
          onPress={handleInspiration}
          style={inspireButton}
          textStyle={inspireButtonText}
        />
      </View>
    </View>
  )
}

// My Stories List Component
const MyStoriesList: FC<{
  stories: PaginatedStories
  navigation: any
  onLoadMore: () => void
}> = ({ stories, navigation, onLoadMore }) => {
  const handlePress = (item: StoryListItem) => {
    const storyForNavigation = {
      ...item,
      isEditable: true,
    }
    navigation.navigate("StoryDetailScreen", { story: storyForNavigation })
  }

  const renderStory = ({ item }: { item: StoryListItem }) => (
    <TouchableOpacity style={card} onPress={() => handlePress(item)}>
      <FastImage
        source={{
          uri: item.storyImage,
          cache: "immutable",
        }}
        style={cardImage as StyleProp<ImageStyle>}
      />
      <View style={cardContent}>
        <Text style={title} numberOfLines={1}>
          {item.header}
        </Text>
        <Text style={description} numberOfLines={2}>
          {item.generatedContent}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const handleEndReached = () => {
    if (stories.currentPage < stories.totalPages) {
      console.log(
        "MyStoriesList - Loading more stories. Current page:",
        stories.currentPage,
        "Total pages:",
        stories.totalPages,
      )
      onLoadMore()
    } else {
      console.log(
        "MyStoriesList - No more pages to load. Current page:",
        stories.currentPage,
        "Total pages:",
        stories.totalPages,
      )
    }
  }

  return (
    <FlatList
      data={stories.stories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStory}
      contentContainerStyle={[list]}
      numColumns={2}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  )
}

const TopicCard: FC<{ topic: Topic[]; navigation: any }> = ({ topic, navigation }) => {
  const handlePress = (item: Topic) => {
    navigation.navigate("CreateStory", { topic: item })
  }

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity style={topicCard} onPress={() => handlePress(item)}>
      <FastImage
        source={{
          uri: item.images[0],
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        style={topicCardImage as StyleProp<ImageStyle>}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={topicCardContent}>
        <Text style={topicTitle} numberOfLines={1} size="xxs">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={topic}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTopic}
      contentContainerStyle={list}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
    />
  )
}

interface HomeScreenProps extends DemoTabScreenProps<"HomeScreen"> {}

// Main HomePage Component
export const HomeScreen: FC<HomeScreenProps> = (_props) => {
  const homeService = new HomeService()
  const { authToken } = useAuthenticationStore()
  const [stories, setStories] = useState<PaginatedStories>({
    stories: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused()

  const fetchStories = async (page = 1) => {
    if (loading || !authToken) {
      console.log("Skipping fetch - loading:", loading, "authToken:", authToken)
      return
    }
    setLoading(true)
    try {
      console.log("Fetching stories with authToken:", authToken, "page:", page)
      const fetchedStories = await homeService.getStories({
        id: authToken,
        page,
        limit: 10,
      })
      console.log("Fetched stories response:", fetchedStories)

      if (fetchedStories && Array.isArray(fetchedStories.stories)) {
        console.log("Setting stories - count:", fetchedStories.stories.length)
        if (page === 1) {
          setStories({
            stories: fetchedStories.stories,
            currentPage: fetchedStories.currentPage,
            totalPages: fetchedStories.totalPages,
            totalItems: fetchedStories.totalItems,
          })
        } else {
          setStories((prev) => ({
            currentPage: fetchedStories.currentPage,
            totalPages: fetchedStories.totalPages,
            totalItems: fetchedStories.totalItems,
            stories: [...prev.stories, ...fetchedStories.stories],
          }))
        }
      } else {
        console.log("No stories found or invalid response")
        setStories({
          stories: [],
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        })
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      setStories({
        stories: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (stories.currentPage < stories.totalPages && !loading) {
      console.log("Loading more stories - page:", stories.currentPage + 1)
      fetchStories(stories.currentPage + 1)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        console.log("No authToken available, skipping fetch")
        return
      }
      console.log("Fetching initial data")
      const fetchedTopics = await homeService.getTopics()
      console.log("Fetched topics:", fetchedTopics)
      if (fetchedTopics && Array.isArray(fetchedTopics)) {
        setTopics(fetchedTopics)
      } else {
        setTopics([])
      }
      fetchStories(1)
    }

    if (isFocused) {
      fetchData()
    }
  }, [isFocused, authToken])

  const handleCategorySelect = (category: { id: number; title: string }) => {
    _props.navigation.navigate("DiscoverScreen", {
      selectedCategory: category.title,
      categoryId: category.id,
    })
  }

  if (!authToken) {
    return (
      <View style={container}>
        <Text style={title}>Please log in to view your stories</Text>
      </View>
    )
  }

  return (
    <View style={container}>
      <View style={{ height: 150 }}>
        <CategoryCard
          categories={topics}
          selectedCategory={""}
          onCategorySelect={handleCategorySelect}
        />
      </View>
      <Spacer size={spacing.md} />
      {loading && stories.totalItems === 0 ? (
        <View style={centerContainer}>
          <Text style={messageText}>Loading stories...</Text>
        </View>
      ) : stories.stories.length === 0 ? (
        <View style={centerContainer}>
          <Text style={messageText}>No stories found</Text>
        </View>
      ) : (
        <MyStoriesList stories={stories} navigation={_props.navigation} onLoadMore={loadMore} />
      )}
    </View>
  )
}

// Styles
const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral150, // Dark background
  padding: 16,
}

const heading: TextStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#1E1E1E",
}

const subheading: TextStyle = {
  fontSize: 24,
  marginVertical: 0,
  fontWeight: "bold",
}

const todayTopicCard: ViewStyle = {
  flexDirection: "row",
  backgroundColor: "#1E1E1E",
  borderRadius: 16,
  overflow: "hidden",
  marginVertical: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
}

const todayTopicImage: ImageStyle = {
  width: 120,
  height: 120,
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
}

const todayTopicContent: ViewStyle = {
  flex: 1,
  padding: 12,
  justifyContent: "space-between",
}

const todayTopicTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "700",
  color: "#FFD700", // Gold text for today's topic title
  marginBottom: 8,
}

const todayTopicDescription: TextStyle = {
  fontSize: 14,
  color: "#B3B3B3",
  lineHeight: 20,
  marginBottom: 8,
}

const inspireButton: ViewStyle = {
  backgroundColor: "#FFD700",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  alignSelf: "flex-start",
}

const inspireButtonText: TextStyle = {
  color: "#1E1E1E",
  fontWeight: "bold",
  fontSize: 14,
}

const list: ViewStyle = {
  paddingBottom: 0,
}

const card: ViewStyle = {
  flexDirection: "column",
  borderRadius: spacing.xs,
  width: Dimensions.get("window").width / 2.3,
  marginHorizontal: spacing.xxs,
}

const topicCard: ViewStyle = {
  flexDirection: "column",
  borderRadius: spacing.xs,
  width: Dimensions.get("window").width / 4,
  marginHorizontal: spacing.xxs,
  height: Dimensions.get("window").width / 1.7,
}

const cardImage: ImageStyle = {
  width: "100%",
  borderRadius: spacing.sm,
  height: Dimensions.get("window").width / 4,
}

const topicCardImage: ImageStyle = {
  width: "100%",
  borderRadius: spacing.sm,
  height: Dimensions.get("window").width / 3,
}

const cardContent: ViewStyle = {
  justifyContent: "center",
  marginTop: spacing.xs,
  marginBottom: spacing.xl,
}

const topicCardContent: ViewStyle = {
  justifyContent: "center",
  marginTop: spacing.xs,
  alignItems: "center",
}

const category: TextStyle = {
  fontSize: 12,
  padding: spacing.xxxs,
  borderRadius: spacing.md,
  borderWidth: 0.5,
  borderColor: "transparent",
  fontWeight: "600",
  textTransform: "uppercase",
  backgroundColor: colors.appSecondary,
  marginBottom: 8,
}

const title: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 8,
}

const topicTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 8,
  color: colors.text,
}

const description: TextStyle = {
  fontSize: 12,
  lineHeight: 20,
}

const cardArrow: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 12,
}

const arrow: TextStyle = {
  fontSize: 18,
  color: "#FFFFFF",
}

const centerContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const messageText: TextStyle = {
  fontSize: 16,
  color: colors.text,
  textAlign: "center",
}
