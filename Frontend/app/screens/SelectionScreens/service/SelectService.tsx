import axios from "axios"

class SelectService {
  characterUrl = process.env.EXPO_PUBLIC_CHARACTERS
  timeUrl = process.env.EXPO_PUBLIC_TIMES
  locationUrl = process.env.EXPO_PUBLIC_LOCATIONS
  topicUrl = process.env.EXPO_PUBLIC_TOPICS
  contentUrl = process.env.EXPO_PUBLIC_CONTENTS
  storyUrl = process.env.EXPO_PUBLIC_STORIES
  async getCharacters() {
    const response = await axios({
      method: "get",
      url: this.characterUrl,
    })
    return response.data
  }

  async getTimes() {
    const response = await axios({
      method: "get",
      url: this.timeUrl,
    })
    console.log("first response", response.data)
    return response.data
  }

  async getLocations() {
    const response = await axios({
      method: "get",
      url: this.locationUrl,
    })
    console.log("first response", response.data)
    return response.data
  }

  async getTopics() {
    const response = await axios({
      method: "get",
      url: this.topicUrl,
    })
    console.log("first response", response.data)
    return response.data
  }

  async getContents() {
    const response = await axios({
      method: "get",
      url: this.contentUrl,
    })
    console.log("first response", response.data)
    return response.data
  }

  async createStory(
    userId: number,
    characters: any[],
    topic: number,
    topicName: string,
    timeId: number,
    timeLapse: string,
    contentId: number,
    contentText: string,
    location: string,
    locationId: number,
    header: string,
    isContinues: boolean,
  ) {
    try {
      const response = await axios.post(`${this.storyUrl}/create`, {
        userId: userId, // Replace with actual user ID
        characterIds: characters.map((c) => c.id),
        characterNames: characters.map((c) => c.name),
        topicId: topic,
        topicName: topicName,
        timeLapse: timeId,
        timeLapseTime: timeLapse,
        content: contentId,
        contentText: contentText,
        location: location,
        locationId: locationId,
        header: header,
        isContinues: isContinues,
      })

      if (response.status === 201) {
        console.log("Story created successfully", response.data)
      }
    } catch (error) {
      console.error("Failed to create story", error)
    }
  }
}

export default SelectService
