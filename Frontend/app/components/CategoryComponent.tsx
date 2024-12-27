import React, { FC } from "react"
import {
  FlatList,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  Dimensions,
  ImageStyle,
} from "react-native"
import { Text, Icon } from "../components"
import { colors, spacing } from "../theme"
import FastImage from "react-native-fast-image"

const { width } = Dimensions.get("window")

interface CategoryCardProps {
  categories: Array<{ id: number; title: string }>
  selectedCategory: string
  onCategorySelect: (category: { id: number; title: string }) => void
}

export const CategoryCard: FC<CategoryCardProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[$categoryCard, selectedCategory === item.title && $selectedCategoryCard]}
      onPress={() => onCategorySelect(item)}
    >
      <FastImage
        source={{
          uri: item.images[0],
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        style={$categoryImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={$categoryContent}>
        <Text
          style={[$categoryTitle, selectedCategory === item.title && $selectedCategoryTitle]}
          numberOfLines={1}
          size="xxs"
        >
          {item.title}
        </Text>
        {selectedCategory === item.title && (
          <Icon icon="check" size={16} color={colors.palette.neutral100} />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCategory}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={$list}
    />
  )
}

const $list: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
}

const $categoryCard: ViewStyle = {
  width: width / 4,
  marginRight: spacing.sm,
  borderRadius: spacing.xs,
  overflow: "hidden",
  backgroundColor: colors.palette.neutral200,
  height: 90,
}

const $selectedCategoryCard: ViewStyle = {
  backgroundColor: colors.appPrimary,
}

const $categoryImage: ImageStyle = {
  width: "100%",
  height: 60,
  borderTopLeftRadius: spacing.xs,
  borderTopRightRadius: spacing.xs,
}

const $categoryContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: spacing.xs,
  height: 30,
}

const $categoryTitle: TextStyle = {
  flex: 1,
  marginRight: spacing.xs,
  color: colors.text,
}

const $selectedCategoryTitle: TextStyle = {
  color: colors.palette.neutral100,
}
