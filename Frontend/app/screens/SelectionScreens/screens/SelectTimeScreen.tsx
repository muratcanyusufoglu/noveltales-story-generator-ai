import React, { FC, useEffect } from "react"
import { SafeAreaView, ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useCreateStoryStore } from "app/store"
import { HeaderComponent } from "../components/HeaderComponent"
import { FooterComponent } from "../components/FooterComponent"
import { TimeListComponent } from "../components/TimeListComponent"
import SelectService from "../service/SelectService"

export const TimeSelectionScreen: FC<DemoTabScreenProps<"TimeSelectionScreen">> = ({
  navigation,
}) => {
  const { setStoryTime, time, setStoryTimeContent } = useCreateStoryStore()
  const [allTimes, setAllTimes] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const service = new SelectService()

  useEffect(() => {
    getTimes()
  }, [])

  const getTimes = async () => {
    await service.getTimes().then((response) => {
      setAllTimes(response)
    })
  }

  const filteredTimes = allTimes.filter((time) =>
    time.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={$container}>
      <HeaderComponent
        title="Select Time"
        searchQuery={searchQuery}
        progressExist={time ? true : false}
        progressValue={40}
        onSearchChange={setSearchQuery}
        currentStep={2}
      />
      <TimeListComponent
        times={filteredTimes}
        selectedTime={time}
        onTimeSelect={(selectedTime) => {
          setStoryTime(selectedTime.id)
          setStoryTimeContent(selectedTime.description)
        }}
      />
      <FooterComponent
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate("LocationSelectionScreen")}
      />
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
