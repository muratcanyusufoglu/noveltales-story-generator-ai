import React, { FC, useEffect } from "react"
import { SafeAreaView, ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useCreateStoryStore } from "app/store"
import { HeaderComponent } from "../components/HeaderComponent"
import { FooterComponent } from "../components/FooterComponent"
import { CharacterListComponent } from "../components/CharacterListComponent"
import SelectService from "../service/SelectService"
import { colors } from "app/theme/colors"

export const CharacterSelectionScreen: FC<DemoTabScreenProps<"CharacterSelectionScreen">> = ({
  navigation,
}) => {
  const { setStoryCharacters, characters } = useCreateStoryStore()
  const [allCharacters, setAllCharacters] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectCharacter = new SelectService()

  useEffect(() => {
    getCharacters()
  }, [])

  const getCharacters = async () => {
    await selectCharacter.getCharacters().then((response) => {
      setAllCharacters(response)
    })
  }

  const filteredCharacters = allCharacters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleCharacterSelection = (character) => {
    console.log(character, characters)
    if (characters.includes(character)) {
      setStoryCharacters(characters.filter((c) => c !== character))
    } else {
      setStoryCharacters([...characters, character])
    }
  }

  return (
    <SafeAreaView style={$container}>
      <HeaderComponent
        title="Select Characters"
        searchQuery={searchQuery}
        progressExist={characters.length > 0 ? true : false}
        progressValue={20}
        onSearchChange={setSearchQuery}
        currentStep={1}
      />
      <CharacterListComponent
        characters={filteredCharacters}
        selectedCharacters={characters}
        onCharacterSelect={toggleCharacterSelection}
      />
      <FooterComponent
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate("TimeSelectionScreen")}
      />
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
  backgroundColor: colors.background,
}
