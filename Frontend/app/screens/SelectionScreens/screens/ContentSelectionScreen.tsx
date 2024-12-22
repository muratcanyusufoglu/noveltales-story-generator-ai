import React, { FC } from "react"
import { SafeAreaView, ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useCreateStoryStore } from "app/store"
import { HeaderComponent } from "../components/HeaderComponent"
import { FooterComponent } from "../components/FooterComponent"
import { ContentListComponent } from "../components/ContentListComponent"
import SelectService from "../service/SelectService"

export const ContentSelectionScreen: FC<DemoTabScreenProps<"ContentSelectionScreen">> = ({
  navigation,
}) => {
  const { setStoryContent, content, setContentId } = useCreateStoryStore()
  const [allContents, setAllContents] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const service = new SelectService()

  React.useEffect(() => {
    getContents()
  }, [])

  const getContents = async () => {
    await service.getContents().then((response) => {
      setAllContents(response)
    })
  }

  const filteredContents = allContents.filter((content) =>
    content.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={$container}>
      <HeaderComponent
        title="Select Content"
        searchQuery={searchQuery}
        progressExist={content ? true : false}
        progressValue={100}
        onSearchChange={setSearchQuery}
        currentStep={5}
      />
      <ContentListComponent
        contents={filteredContents}
        selectedContent={content}
        onContentSelect={(item) => {
          setStoryContent(item.description)
          setContentId(item.id)
        }}
      />
      <FooterComponent
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate("SummarySelectionScreen")}
        isSelectionMade={content !== null}
      />
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
