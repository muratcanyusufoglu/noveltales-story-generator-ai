import React, { FC } from "react"
import { FlatList, TouchableOpacity, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Icon, Text } from "../../../components"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface LocationListComponentProps {
  locations: any[]
  selectedLocations: string[]
  onLocationSelect: (location: any) => void
}

export const LocationListComponent: FC<LocationListComponentProps> = ({
  locations,
  selectedLocations,
  onLocationSelect,
}) => {
  const renderLocation = ({ item, index }) => {
    const isLastRow = index >= locations.length - 2
    return (
      <TouchableOpacity
        style={[
          $location,
          selectedLocations.includes(item.name) ? $locationSelected : $locationUnselected,
          isLastRow && $lastRowMargin,
        ]}
        onPress={() => onLocationSelect(item)}
      >
        <View style={$locationRow}>
          {selectedLocations.includes(item.name) && (
            <Icon
              icon="check"
              color={selectedLocations.includes(item.name) ? "white" : "black"}
              size={20}
            />
          )}
          <Text
            size="xs"
            style={
              selectedLocations.includes(item.name)
                ? $locationTextSelected
                : $locationTextUnselected
            }
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={locations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderLocation}
      numColumns={2}
    />
  )
}

const $location: ViewStyle = {
  borderWidth: 1,
  padding: 15,
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

const $locationSelected: ViewStyle = {
  backgroundColor: colors.palette.chipSelect,
  borderColor: colors.palette.borderColor,
}

const $locationUnselected: ViewStyle = {
  backgroundColor: colors.palette.chipUnSelect,
  borderColor: colors.palette.chipUnSelect,
}

const $locationRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $locationTextSelected: TextStyle = {
  marginLeft: 10,
  color: "white",
}

const $locationTextUnselected: TextStyle = {
  color: "black",
}

const $lastRowMargin: ViewStyle = {
  marginBottom: 50,
}
