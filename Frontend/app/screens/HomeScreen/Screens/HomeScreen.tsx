import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react"
import { View, FlatList, Image, Alert, Dimensions } from "react-native"
import { Text, Button } from "../../../components"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import HomeService from "../Service/HomeService"
import { useAuthenticationStore } from "app/store"
import Animated from "react-native-reanimated"
import { colors, spacing } from "app/theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"

// Inspiration of the Day Component
const InspirationOfTheDay: FC<{ todayTopic: any; handleInspiration: () => void }> = ({
  todayTopic,
  handleInspiration,
}) => {
  return (
    <View style={todayTopicCard}>
      <Image source={{ uri: todayTopic.imageUrl }} style={todayTopicImage} />
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
const MyStoriesList: FC<{ stories: any[]; navigation: any }> = ({ stories, navigation }) => {
  const handlePress = (item: any) => {
    navigation.navigate("StoryDetailScreen", { story: item })
  }
  const renderStory = ({ item }) => (
    <TouchableOpacity style={card} onPress={() => handlePress(item)}>
      <Animated.Image
        source={{
          uri: item.storyImage,
        }}
        style={cardImage}
        sharedTransitionTag={item.id.toString()}
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

  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStory}
      contentContainerStyle={[list]}
      numColumns={2}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  )
}

const TopicCard: FC<{ topic: any; navigation: any }> = ({ topic, navigation }) => {
  const handlePress = (item: any) => {
    navigation.navigate("CreateStory", { topic: item })
  }

  const renderTopic = ({ item }) => {
    return (
      <TouchableOpacity style={topicCard} onPress={() => handlePress(item)}>
        <Image
          source={{
            uri: item.images[0],
          }}
          style={topicCardImage}
        />
        <View style={topicCardContent}>
          <Text style={topicTitle} numberOfLines={1} size="xxs">
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
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
  const [stories, setStories] = useState([])
  const [topics, setTopics] = useState([])

  const isFocused = useIsFocused()

  useEffect(() => {
    const fetchStories = async () => {
      const stories = await homeService.getStories({ id: authToken ?? 0 })
      const topics = await homeService.getTopics()

      setStories(stories)
      setTopics(topics)
    }
    fetchStories()
  }, [isFocused])

  const handleInspiration = () => {
    Alert.alert("Start a New Story", `Inspired by today's topic: ${todayTopic.topicName}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start Writing",
        onPress: () => _props.navigation.navigate("CreateStory", { topic: todayTopic }),
      },
    ])
  }

  return (
    <View style={container}>
      <TopicCard topic={topics} navigation={_props.navigation} />
      <MyStoriesList stories={stories} navigation={_props.navigation} />
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
