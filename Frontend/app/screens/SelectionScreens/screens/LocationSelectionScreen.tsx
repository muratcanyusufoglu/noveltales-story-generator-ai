import React, { FC, useEffect } from "react"
import { SafeAreaView, ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useCreateStoryStore } from "app/store"
import { HeaderComponent } from "../components/HeaderComponent"
import { ProgressBarComponent } from "../components/ProgressBarComponent"
import { LocationListComponent } from "../components/LocationListComponent"
import { FooterComponent } from "../components/FooterComponent"
import SelectService from "../service/SelectService"

export const LocationSelectionScreen: FC<DemoTabScreenProps<"LocationSelectionScreen">> = ({
  navigation,
}) => {
  const { setStoryLocations, locations, setLocationId } = useCreateStoryStore()
  const [allLocations, setAllLocations] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const service = new SelectService()

  useEffect(() => {
    getLocations()
  }, [])

  const getLocations = async () => {
    await service.getLocations().then((response) => {
      setAllLocations(response)
    })
  }

  const filteredLocations = allLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={$container}>
      <HeaderComponent
        title="Select Location"
        searchQuery={searchQuery}
        progressExist={locations.length > 0 ? true : false}
        progressValue={60}
        onSearchChange={setSearchQuery}
        currentStep={3}
      />
      <LocationListComponent
        locations={filteredLocations}
        selectedLocations={locations}
        onLocationSelect={(location) => {
          setStoryLocations(location.name)
          setLocationId(location.id)
        }}
      />
      <FooterComponent
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate("TopicSelectionScreen")}
        isSelectionMade={locations.length > 0}
      />
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
