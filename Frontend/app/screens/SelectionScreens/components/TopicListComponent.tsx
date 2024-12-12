import React, { FC } from "react"
import { FlatList, TouchableOpacity, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Icon, Text } from "../../../components"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface TopicListComponentProps {
  topics: any[]
  selectedTopic: string | null | number
  onTopicSelect: (topic: any) => void
}

export const TopicListComponent: FC<TopicListComponentProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
}) => {
  const renderTopic = ({ item, index }) => {
    const isLastRow = index >= topics.length - 2
    return (
      <TouchableOpacity
        style={[
          $topic,
          selectedTopic === item.id ? $topicSelected : $topicUnselected,
          isLastRow && $lastRowMargin,
        ]}
        onPress={() => onTopicSelect(item)}
      >
        <View style={$topicRow}>
          {selectedTopic === item.id && (
            <Icon icon="check" color={selectedTopic === item.id ? "white" : "black"} size={20} />
          )}
          <Text
            numberOfLines={1}
            size="xs"
            style={selectedTopic === item.id ? $topicTextSelected : $topicTextUnselected}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={topics}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTopic}
      numColumns={2}
    />
  )
}

const $topic: ViewStyle = {
  borderWidth: 1,
  paddingHorizontal: 20,
  margin: 10,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  height: height / 18,
  width: width / 2.5,
  alignItems: "center",
  justifyContent: "center",
}

const $topicSelected: ViewStyle = {
  backgroundColor: colors.palette.chipSelect,
  borderColor: colors.palette.borderColor,
}

const $topicUnselected: ViewStyle = {
  backgroundColor: colors.palette.chipUnSelect,
  borderColor: colors.palette.chipUnSelect,
}

const $topicRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $topicTextSelected: TextStyle = {
  color: "white",
  marginLeft: 10,
}

const $topicTextUnselected: TextStyle = {
  color: "black",
}

const $lastRowMargin: ViewStyle = {
  marginBottom: 50,
}
