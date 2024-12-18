import React, { FC } from "react"
import { FlatList, TouchableOpacity, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Icon, Text } from "../../../components"
import { colors, spacing } from "app/theme"

const { width, height } = Dimensions.get("window")

interface CharacterListComponentProps {
  characters: any[]
  selectedCharacters: any[]
  onCharacterSelect: (character: any) => void
}

export const CharacterListComponent: FC<CharacterListComponentProps> = ({
  characters,
  selectedCharacters,
  onCharacterSelect,
}) => {
  const renderCharacter = ({ item, index }) => {
    const isLastRow = index >= characters.length - 2
    return (
      <TouchableOpacity
        style={[
          $character,
          selectedCharacters.map((character) => character.id).includes(item.id)
            ? $characterSelected
            : $characterUnselected,
          isLastRow && $lastRowMargin,
        ]}
        onPress={() => onCharacterSelect(item.name)}
      >
        <View style={$characterRow}>
          {selectedCharacters.map((character) => character.id).includes(item.id) && (
            <Icon icon="check" color={colors.inputBackground} size={20} />
          )}
          <Text
            numberOfLines={1}
            size="xs"
            style={
              selectedCharacters.map((character) => character.id).includes(item.id)
                ? $characterName
                : $characterNameUnselected
            }
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={$container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}
        numColumns={2}
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  marginTop: spacing.md,
}

const $character: ViewStyle = {
  borderWidth: 1,
  padding: 15,
  margin: 10,
  borderRadius: 10,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  width: width / 2.5,
  alignItems: "center",
  justifyContent: "center",
}

const $characterSelected: ViewStyle = {
  backgroundColor: colors.appPrimary,
  borderColor: colors.appPrimary,
}

const $characterUnselected: ViewStyle = {
  backgroundColor: colors.inputBackground,
  borderColor: colors.palette.chipUnSelect,
}

const $characterRow: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $characterName: TextStyle = {
  marginLeft: 10,
  color: "white",
}

const $characterNameUnselected: TextStyle = {
  marginLeft: 0,
}

const $lastRowMargin: ViewStyle = {
  marginBottom: 50,
}
