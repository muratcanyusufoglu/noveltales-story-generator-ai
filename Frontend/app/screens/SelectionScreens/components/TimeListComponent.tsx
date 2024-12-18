import React, { FC } from "react"
import { FlatList, TouchableOpacity, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Icon, Text } from "../../../components"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface TimeListComponentProps {
  times: any[]
  selectedTime: number | null
  onTimeSelect: (time: any) => void
}

export const TimeListComponent: FC<TimeListComponentProps> = ({
  times,
  selectedTime,
  onTimeSelect,
}) => {
  const renderTime = ({ item, index }) => {
    const isLastRow = index >= times.length - 2

    return (
      <TouchableOpacity
        style={[
          $time,
          selectedTime === item.id ? $timeSelected : $timeUnselected,
          isLastRow && $lastRowMargin,
        ]}
        onPress={() => onTimeSelect(item)}
      >
        <View style={$timeRow}>
          {selectedTime === item.id && (
            <Icon icon="check" color={selectedTime === item.id ? "white" : "black"} size={20} />
          )}
          <Text
            size="xs"
            style={selectedTime === item.id ? $timeTextSelected : $timeTextUnselected}
          >
            {item.date},{"\n"}
            {item.type},{"\n"}
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={times}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTime}
      numColumns={2}
    />
  )
}

const $time: ViewStyle = {
  borderWidth: 1,
  padding: 20,
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

const $timeSelected: ViewStyle = {
  backgroundColor: colors.palette.chipSelect,
  borderColor: colors.palette.borderColor,
}

const $timeUnselected: ViewStyle = {
  backgroundColor: colors.palette.chipUnSelect,
  borderColor: colors.palette.chipUnSelect,
}

const $timeRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $timeTextSelected: TextStyle = {
  color: "white",
  marginLeft: 10,
}

const $timeTextUnselected: TextStyle = {
  color: "black",
}

const $lastRowMargin: ViewStyle = {
  marginBottom: 50,
}
