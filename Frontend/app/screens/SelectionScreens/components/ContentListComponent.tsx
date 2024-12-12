import React, { FC } from "react"
import { FlatList, TouchableOpacity, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Icon, Text } from "../../../components"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface ContentListComponentProps {
  contents: any[]
  selectedContent: string | null
  onContentSelect: (content: any) => void
}

export const ContentListComponent: FC<ContentListComponentProps> = ({
  contents,
  selectedContent,
  onContentSelect,
}) => {
  const renderContent = ({ item, index }) => {
    const isLastRow = index >= contents.length - 2
    return (
      <TouchableOpacity
        style={[
          $content,
          selectedContent === item.description ? $contentSelected : $contentUnselected,
          isLastRow && $lastRowMargin,
        ]}
        onPress={() => onContentSelect(item)}
      >
        <View style={$contentRow}>
          {selectedContent === item.description && (
            <Icon
              icon="check"
              color={selectedContent === item.description ? "white" : "black"}
              size={20}
            />
          )}
          <Text
            size="xs"
            style={
              item.description == selectedContent ? $contentTextSelected : $contentTextUnselected
            }
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={contents}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderContent}
      numColumns={2}
    />
  )
}

const $content: ViewStyle = {
  borderWidth: 1,
  paddingHorizontal: 20,
  paddingVertical: 15,
  margin: 10,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  width: width / 2.5,
  alignItems: "center",
  justifyContent: "center",
}

const $contentSelected: ViewStyle = {
  backgroundColor: colors.palette.chipSelect,
  borderColor: colors.palette.borderColor,
}

const $contentUnselected: ViewStyle = {
  backgroundColor: colors.palette.chipUnSelect,
  borderColor: colors.palette.chipUnSelect,
}

const $contentRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $contentTextSelected: TextStyle = {
  color: "white",
  marginLeft: 10,
}

const $contentTextUnselected: TextStyle = {
  color: "black",
}

const $lastRowMargin: ViewStyle = {
  marginBottom: 50,
}
