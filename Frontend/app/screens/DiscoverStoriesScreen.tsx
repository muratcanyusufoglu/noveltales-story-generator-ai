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
import { PaginatedResponse } from "app/store/Story"

const SCREEN_WIDTH = Dimensions.get("window").width
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2

// Fallback image if story image is missing
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"

interface Story {
  id: number
  header: string
  storyImage: string
  generatedContent: string
  imageUrl: string
  contentText: string
  isContinues: boolean
}

export const DiscoverStoriesScreen: FC<DemoTabScreenProps<"DiscoverScreen">> = ({
  route,
  navigation,
}) => {
  const [stories, setStories] = useState<PaginatedResponse<Story>>({
    items: [],
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
      console.log("Fetching discover stories")
      const response = await homeService.getStories({
        id: 61,
        page,
        limit: 10,
      })
      console.log("Discover stories response:", response)

      if (response && response.items) {
        if (page === 1) {
          setStories(response)
          setRecommendedStories(response.items.slice(0, 10))
        } else {
          setStories((prev) => ({
            ...response,
            items: [...(prev.items || []), ...(response.items || [])],
          }))
        }
      } else {
        setStories({
          items: [],
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error)
      setStories({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories")
      const response = await homeService.getTopics()
      console.log("Categories response:", response)
      if (response && Array.isArray(response)) {
        setCategories(response)
        if (response.length > 0 && !initialCategory) {
          setSelectedCategory(response[0].title)
        }
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([])
    }
  }

  const fetchStoriesByCategory = async (categoryId: number, page = 1) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      console.log("Fetching stories for category:", categoryId)
      const response = await homeService.getStoriesByCategory(categoryId, { page, limit: 10 })
      console.log("Category stories response:", response)

      if (response && response.items) {
        if (page === 1) {
          setStories(response)
        } else {
          setStories((prev) => ({
            ...response,
            items: [...(prev.items || []), ...(response.items || [])],
          }))
        }
      } else {
        setStories({
          items: [],
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch stories by category:", error)
      setStories({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (stories.currentPage < stories.totalPages && !isLoading) {
      if (initialCategoryId) {
        fetchStoriesByCategory(initialCategoryId, stories.currentPage + 1)
      } else {
        fetchStories(stories.currentPage + 1)
      }
    }
  }

  const handleCategorySelect = (category: { id: number; title: string }) => {
    setSelectedCategory(category.title)
    fetchStoriesByCategory(category.id, 1)
  }

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCategories()
      if (initialCategory && initialCategoryId) {
        setSelectedCategory(initialCategory)
        fetchStoriesByCategory(initialCategoryId, 1)
      } else {
        fetchStories(1)
      }
    }

    loadInitialData()
  }, [initialCategory, initialCategoryId])

  const handleStoryPress = (story: Story) => {
    navigation.navigate("StoryDetailScreen", { story })
  }

  const StoryCard = ({ story }: { story: Story }) => (
    <TouchableOpacity
      style={$storyCard}
      onPress={() => handleStoryPress(story)}
      activeOpacity={0.7}
    >
      <FastImage
        source={{ uri: story.storyImage || FALLBACK_IMAGE }}
        style={$storyImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={$storyContent}>
        <Text style={$storyTitle} numberOfLines={2}>
          {story.header || "Untitled Story"}
        </Text>
        <Text style={$storyContentText} numberOfLines={1}>
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
          data={stories.items}
          renderItem={({ item }: { item: Story }) => <StoryCard story={item} />}
          keyExtractor={(item: Story) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={$storiesGrid}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={() => {
            if (initialCategoryId) {
              fetchStoriesByCategory(initialCategoryId, 1)
            } else {
              fetchStories(1)
            }
          }}
          ListEmptyComponent={
            <View style={$emptyContainer}>
              <Text style={$messageText}>
                {isLoading ? "Loading stories..." : "No stories available"}
              </Text>
            </View>
          }
        />

        {/* Recommended Stories Section */}
        {recommendedStories.length > 0 && (
          <View style={$recommendedSection}>
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
          </View>
        )}
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
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
}

const $storyCard: ViewStyle = {
  width: CARD_WIDTH,
  marginBottom: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  overflow: "hidden",
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}

const $storyImage: ImageStyle = {
  width: "100%",
  height: CARD_WIDTH,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
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
}

const $sectionTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
  paddingHorizontal: spacing.md,
  marginBottom: spacing.sm,
}

const $recommendedContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
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

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: spacing.xl,
}
