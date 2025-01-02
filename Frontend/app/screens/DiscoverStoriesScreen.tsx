import React, { FC, useEffect, useState } from "react"
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ViewStyle,
  TextStyle,
  StyleProp,
  FlatList,
} from "react-native"
import { Text } from "../components"
import { colors, spacing } from "../theme"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import HomeService from "./HomeScreen/Service/HomeService"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { CategoryCard } from "app/components/CategoryComponent"

const SCREEN_WIDTH = Dimensions.get("window").width
const PADDING = spacing.md
const NUMBER_OF_COLUMNS = 2
const CARD_MARGIN = spacing.sm
const TOTAL_MARGIN = CARD_MARGIN * (NUMBER_OF_COLUMNS + 1)
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2

// Fallback image if story image is missing
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"

interface Story {
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
  imageUrl?: string
  isContinues: boolean
  totalPartCount: number
  createdAt: string
  updatedAt: string
  isEditable?: boolean
}

interface PaginatedStories {
  stories: Story[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export const DiscoverStoriesScreen: FC<DemoTabScreenProps<"DiscoverScreen">> = ({
  route,
  navigation,
}) => {
  const [stories, setStories] = useState<PaginatedStories>({
    stories: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })
  const [recommendedStories, setRecommendedStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Fantasy")
  const [categories, setCategories] = useState<Array<{ id: number; title: string }>>([])

  const homeService = new HomeService()

  // Get category params from route if they exist
  const initialCategory = route.params?.selectedCategory
  const initialCategoryId = route.params?.categoryId

  const fetchStories = async (page = 1) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const response = await homeService.getStories({
        id: 61,
        page,
        limit: 10,
      })

      if (response) {
        if (page === 1) {
          setStories({
            stories: response.stories,
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
          })
          setRecommendedStories(response.stories.slice(0, 10))
        } else {
          setStories((prev) => ({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
            stories: [...prev.stories, ...response.stories],
          }))
        }
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await homeService.getTopics()
      if (response && Array.isArray(response)) {
        setCategories(response)
        // If we have categories and no initial category is set, fetch stories for the first category
        if (response.length > 0 && !initialCategory && !initialCategoryId) {
          setSelectedCategory(response[0].title)
          fetchStoriesByCategory(response[0].id, 1)
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchStoriesByCategory = async (categoryId: number, page = 1) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const response = await homeService.getStoriesByCategory(categoryId, { page, limit: 10 })
      if (response) {
        if (page === 1) {
          setStories({
            stories: response.stories || [],
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
          })
        } else {
          setStories((prev) => ({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
            stories: [...prev.stories, ...(response.stories || [])],
          }))
        }
      }
    } catch (error) {
      setStories({ stories: [], currentPage: 1, totalPages: 1, totalItems: 0 })
      console.error("Failed to fetch stories by category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = async () => {
    if (stories.currentPage < stories.totalPages && !isLoading) {
      console.log("Loading more stories for page:", stories.currentPage + 1)
      setIsLoading(true)
      try {
        let response
        if (selectedCategory && categories.length > 0) {
          const selectedCategoryId = categories.find((cat) => cat.title === selectedCategory)?.id
          if (selectedCategoryId) {
            response = await homeService.getStoriesByCategory(selectedCategoryId, {
              page: stories.currentPage + 1,
              limit: 10,
            })
          }
        } else {
          response = await homeService.getStories({
            id: 61,
            page: stories.currentPage + 1,
            limit: 10,
          })
        }

        if (response) {
          setStories((prev) => ({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
            stories: [...prev.stories, ...response.stories],
          }))
        }
      } catch (error) {
        console.error("Failed to load more stories:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCategorySelect = async (category: { id: number; title: string }) => {
    console.log("Selected category:", category)
    setSelectedCategory(category.title)
    setIsLoading(true)
    try {
      const response = await homeService.getStoriesByCategory(category.id, { page: 1, limit: 10 })
      console.log("Category stories response:", response)
      if (response) {
        setStories({
          stories: response.stories || [],
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        })
      } else {
        setStories({
          stories: [],
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch stories for category:", error)
      setStories({
        stories: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialCategory && initialCategoryId) {
      setSelectedCategory(initialCategory)
      fetchStoriesByCategory(initialCategoryId, 1)
    }
    fetchCategories()
  }, [initialCategory, initialCategoryId])

  const handleStoryPress = (story: Story) => {
    const storyForNavigation = {
      id: story.id,
      header: story.header,
      contentText: story.contentText,
      generatedContent: story.generatedContent,
      storyImage: story.storyImage,
      imageUrl: story.storyImage,
      isContinues: story.isContinues,
      isEditable: false,
    }
    navigation.navigate("StoryDetailScreen", { story: storyForNavigation })
  }

  const StoryCard = ({ story }: { story: Story }) => (
    <TouchableOpacity style={$storyCard} onPress={() => handleStoryPress(story)}>
      <FastImage
        source={{ uri: story.storyImage || FALLBACK_IMAGE }}
        style={$storyImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={$storyContent}>
        <Text style={$storyTitle} numberOfLines={2}>
          {story.header || "Untitled Story"}
        </Text>
        <Text style={$storyContentText} numberOfLines={2}>
          {story.generatedContent || "No content available"}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const RecommendedStoryCard = ({ story }: { story: Story }) => (
    <TouchableOpacity
      style={$recommendedCard}
      onPress={() => handleStoryPress(story)}
      activeOpacity={0.7}
    >
      <FastImage
        source={{ uri: story.storyImage || FALLBACK_IMAGE }}
        style={$recommendedImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={$recommendedContent}>
        <Text style={$recommendedTitle} numberOfLines={2}>
          {story.header || "Untitled Story"}
        </Text>
        <Text style={$recommendedContentText} numberOfLines={1}>
          {story.generatedContent || "No content available"}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={$container}>
      <View style={$root}>
        {/* Categories */}
        <CategoryCard
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Stories Grid */}
        <FlatList<Story>
          data={stories.stories}
          renderItem={({ item }: { item: Story }) => <StoryCard story={item} />}
          keyExtractor={(item: Story) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={$storiesGrid}
          onEndReached={loadMore}
          refreshing={isLoading}
          onRefresh={() => fetchStories(1)}
          ListEmptyComponent={
            <Text style={$messageText}>
              {isLoading ? "Loading stories..." : "No stories available"}
            </Text>
          }
        />

        {/* Recommended Stories Section */}
        {/* <View style={$recommendedSection}>
          <Text style={$sectionTitle}>Recommended For You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$recommendedContainer}
          >
            {recommendedStories.map((story, index) => (
              <RecommendedStoryCard key={story.id || index} story={story} />
            ))}
          </ScrollView>
        </View> */}
      </View>
    </SafeAreaView>
  )
}

// Styles
const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $categoriesContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
}

const $categoryButton: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  marginRight: spacing.sm,
  borderRadius: 20,
  backgroundColor: colors.palette.neutral200,
}

const $selectedCategory: ViewStyle = {
  backgroundColor: colors.palette.primary500,
}

const $categoryText: TextStyle = {
  fontSize: 14,
  color: colors.text,
}

const $selectedCategoryText: TextStyle = {
  color: colors.palette.neutral100,
}

const $storiesContainer: ViewStyle = {
  padding: spacing.md,
}

const $storiesGrid: ViewStyle = {
  paddingHorizontal: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
}

const $columnWrapper: ViewStyle = {
  justifyContent: "flex-start",
}

const $storyCard: ViewStyle = {
  marginBottom: spacing.md,
  width: Dimensions.get("window").width / 2.3,
  marginHorizontal: spacing.xxs,
}

const $storyImage: ImageStyle = {
  height: Dimensions.get("window").width / 4,

  borderRadius: 12,
}

const $storyContent: ViewStyle = {
  padding: spacing.xs,
}

const $storyTitle: TextStyle = {
  fontSize: 14,
  fontWeight: "bold",
  color: colors.text,
}

const $messageText: TextStyle = {
  textAlign: "center",
  padding: spacing.lg,
  color: colors.text,
}

const $recommendedSection: ViewStyle = {
  marginTop: spacing.lg,
  paddingBottom: spacing.xl,
  width: "100%",
  alignItems: "center",
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
  textAlign: "center",
  width: "100%",
  marginBottom: spacing.sm,
}

const $recommendedContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  alignItems: "center",
  justifyContent: "center",
}

const $recommendedCard: ViewStyle = {
  marginRight: spacing.md,
  borderRadius: 12,
  overflow: "hidden",
}

const $recommendedImage: ImageStyle = {
  width: 120,
  height: 120,
  borderRadius: 12,
}

const $recommendedContent: ViewStyle = {
  padding: spacing.xs,
}

const $recommendedTitle: TextStyle = {
  fontSize: 14,
  fontWeight: "bold",
  color: colors.text,
}

const $storyContentText: TextStyle = {
  fontSize: 12,
  color: colors.text,
  marginTop: spacing.xxs,
}

const $recommendedContentText: TextStyle = {
  fontSize: 12,
  color: colors.text,
  marginTop: spacing.xxs,
}
