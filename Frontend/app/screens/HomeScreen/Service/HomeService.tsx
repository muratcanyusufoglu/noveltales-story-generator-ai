import axios from "axios"

class HomeService {
  storiesUrl = process.env.EXPO_PUBLIC_STORIES
  topicsUrl = process.env.EXPO_PUBLIC_TOPICS

  async getStories({ id }: { id: number }) {
    const allUserStoryUrl = process.env.EXPO_PUBLIC_STORIES + "/user/" + id
    const response = await axios({
      method: "get",
      url: allUserStoryUrl,
    })
    return response.data
  }

  async getTopics() {
    const response = await axios({
      method: "get",
      url: this.topicsUrl,
    })
    return response.data
  }

  async updateStory({
    id,
    header,
    generatedContent,
  }: {
    id: number
    header: string
    generatedContent: string
  }) {
    console.log("updateStory", id, header, generatedContent)
    const updateStoryUrl = process.env.EXPO_PUBLIC_STORIES + "/" + id
    const response = await axios({
      method: "put",
      url: updateStoryUrl,
      data: {
        header: header,
        generatedContent: generatedContent,
      },
    })
    console.log("updateStory response", response.data)
    return response.data
  }

  async continueStory({ id, generatedContent }: { id: number; generatedContent: string }) {
    const continueStoryUrl = process.env.EXPO_PUBLIC_STORIES + "/" + id + "/continue"
    const response = await axios({
      method: "put",
      url: continueStoryUrl,
      data: {
        contentText: generatedContent,
      },
    })
    return response.data
  }
}

export default HomeService
