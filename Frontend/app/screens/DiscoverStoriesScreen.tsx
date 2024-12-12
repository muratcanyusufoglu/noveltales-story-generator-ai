import React, { FC, useEffect } from "react"
import {
  ActivityIndicator,
  ImageStyle,
  SafeAreaView,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import Animated from "react-native-reanimated"
import { EmptyState, ListView, Text } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { useEpisodeStore, Episode } from "app/store"

const ICON_SIZE = 14

export const DiscoverStoriesScreen: FC<DemoTabScreenProps<"DiscoverScreen">> = (_props) => {
  const episodeStore = useEpisodeStore()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await episodeStore.fetchEpisodes()
      setIsLoading(false)
    })()
  }, [])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([episodeStore.fetchEpisodes(), delay(750)])
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={$container}>
      <ListView<Episode>
        contentContainerStyle={$listContentContainer}
        data={episodeStore.episodesForList.slice()}
        extraData={episodeStore.favorites.length + episodeStore.episodes.length}
        refreshing={refreshing}
        estimatedItemSize={177}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                episodeStore.favoritesOnly
                  ? "discoverStoriesScreen.noFavoritesEmptyState.heading"
                  : undefined
              }
              contentTx={
                episodeStore.favoritesOnly
                  ? "discoverStoriesScreen.noFavoritesEmptyState.content"
                  : undefined
              }
              button={episodeStore.favoritesOnly ? "" : undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        renderItem={({ item }) => (
          <StoryCard
            episode={item}
            isFavorite={episodeStore.hasFavorite(item)}
            onPressFavorite={() => episodeStore.toggleFavorite(item)}
            navigation={_props.navigation}
          />
        )}
      />
    </SafeAreaView>
  )
}

const StoryCard = ({
  episode,
  isFavorite,
  onPressFavorite,
  navigation,
}: {
  episode: Episode
  onPressFavorite: () => void
  isFavorite: boolean
  navigation: any
}) => {
  const handlePress = () => {
    navigation.navigate("StoryDetailScreen", { story: episode })
  }

  return (
    <TouchableOpacity style={$card} onPress={handlePress}>
      <Animated.Image
        source={{ uri: episode.link }}
        style={$cardImage}
        sharedTransitionTag={episode.link.toString()}
      />
      <View style={$cardContent}>
        <Text style={$category} numberOfLines={1}>
          {episode.author}
        </Text>
        <Text style={$title} numberOfLines={1}>
          {episode.title}
        </Text>
        <Text style={$description} numberOfLines={2}>
          {episode.description}
        </Text>
      </View>
      <View style={$cardArrow}>
        <Text style={$arrow}>➤</Text>
      </View>
    </TouchableOpacity>
  )
}

// Updated styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral150,
  padding: spacing.md,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.sm,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
}

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $card: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.xs,
  marginVertical: spacing.sm,
  shadowColor: "#161313FF",
  shadowOffset: { width: 0.01, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 1,
  elevation: 1,
}

const $cardImage: ImageStyle = {
  width: 120,
  borderTopLeftRadius: spacing.xxs,
  borderBottomLeftRadius: spacing.xxs,
}

const $cardContent: ViewStyle = {
  flex: 1,
  padding: spacing.sm,
  justifyContent: "center",
}

const $category: TextStyle = {
  fontSize: 12,
  padding: spacing.xxxs,
  borderRadius: spacing.md,
  borderWidth: 0.5,
  borderColor: "transparent",
  fontWeight: "600",
  textTransform: "uppercase",
  backgroundColor: colors.appSecondary,
  marginBottom: spacing.xs,
}

const $title: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: spacing.xs,
}

const $description: TextStyle = {
  fontSize: 12,
  lineHeight: 20,
}

const $cardArrow: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.sm,
}

const $arrow: TextStyle = {
  fontSize: 18,
  color: colors.text,
}
