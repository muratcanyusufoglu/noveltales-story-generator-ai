import React, { FC, useEffect } from "react"
import { SafeAreaView, ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useCreateStoryStore } from "app/store"
import { HeaderComponent } from "../components/HeaderComponent"
import { FooterComponent } from "../components/FooterComponent"
import { TopicListComponent } from "../components/TopicListComponent"
import SelectService from "../service/SelectService"

export const TopicSelectionScreen: FC<DemoTabScreenProps<"TopicSelectionScreen">> = ({
  navigation,
}) => {
  const { setStoryTopic, topic, setTopicId, topicId } = useCreateStoryStore()
  const [allTopics, setAllTopics] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const service = new SelectService()

  useEffect(() => {
    getTopics()
  }, [])

  const getTopics = async () => {
    await service.getTopics().then((response) => {
      setAllTopics(response)
    })
  }

  const filteredTopics = allTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={$container}>
      <HeaderComponent
        title="Select Topic"
        searchQuery={searchQuery}
        progressExist={topic ? true : false}
        progressValue={80}
        onSearchChange={setSearchQuery}
        currentStep={4}
      />
      <TopicListComponent
        topics={filteredTopics}
        selectedTopic={topicId}
        onTopicSelect={(item) => {
          setStoryTopic(item.title + ", " + item.description)
          setTopicId(item.id)
        }}
      />
      <FooterComponent
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate("ContentSelectionScreen")}
      />
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
