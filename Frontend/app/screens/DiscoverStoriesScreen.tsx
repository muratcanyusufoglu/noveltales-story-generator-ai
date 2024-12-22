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
  ImageStyle,
} from "react-native"
import { Text } from "../components"
import { colors, spacing } from "../theme"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import HomeService from "./HomeScreen/Service/HomeService"
import FastImage from "react-native-fast-image"

const SCREEN_WIDTH = Dimensions.get("window").width
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2

// Sample categories
const CATEGORIES = ["Fantasy", "Horror", "Mystery", "Adventure", "Comedy"]

// Fallback image if story image is missing
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"

interface Story {
  id: number
  header: string
  storyImage: string
  generatedContent: string
}

export const DiscoverStoriesScreen: FC<DemoTabScreenProps<"DiscoverScreen">> = ({ navigation }) => {
  const [stories, setStories] = useState<Story[]>([])
  const [recommendedStories, setRecommendedStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Fantasy")

  const homeService = new HomeService()

  const fetchStories = async () => {
    setIsLoading(true)
    try {
      const response = await homeService.getStories({ id: 61 })
      if (response && Array.isArray(response)) {
        setStories(response)
        setRecommendedStories(response.slice(0, 10))
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

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
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchStories} />}
      >
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={$categoriesContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[$categoryButton, selectedCategory === category && $selectedCategory]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[$categoryText, selectedCategory === category && $selectedCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stories Grid */}
        <View style={$storiesContainer}>
          {isLoading ? (
            <Text style={$messageText}>Loading stories...</Text>
          ) : stories.length === 0 ? (
            <Text style={$messageText}>No stories available</Text>
          ) : (
            <View style={$storiesGrid}>
              {stories.map((story, index) => (
                <StoryCard key={story.id || index} story={story} />
              ))}
            </View>
          )}
        </View>

        {/* Recommended Stories Section */}
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
      </ScrollView>
    </SafeAreaView>
  )
}

// Styles with TypeScript types
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
  borderRadius: 12,
  overflow: "hidden",
}

const $storyImage: ImageStyle = {
  width: "100%",
  height: SCREEN_WIDTH / 2.4,
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
  width: SCREEN_WIDTH / 1.5,
  height: SCREEN_WIDTH / 3,
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
