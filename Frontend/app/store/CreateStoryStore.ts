import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"

export interface CreateStoryStore {
  // Story properties
  title: string
  characters: any[]
  locations: string
  locationId: number
  topic: string
  topicId: number
  content: string
  contentId: number
  timeContent: string
  time: number

  // Actions
  setStoryTitle: (value: string) => void
  setStoryCharacters: (value: any) => void
  setStoryLocations: (value: string) => void
  setLocationId: (value: number) => void
  setStoryTopic: (value: string) => void
  setTopicId: (value: number) => void
  setStoryContent: (value: string) => void
  setContentId: (value: number) => void
  setStoryTimeContent: (value: string) => void
  setStoryTime: (value: number) => void
  resetStore: () => void

  // Add new delete actions
  deleteStoryCharacters: () => void
  deleteStoryLocations: () => void
  deleteStoryTopic: () => void
  deleteStoryContent: () => void
  deleteStoryTime: () => void
}

export const createCreateStorySlice: StateCreator<RootStore, [], [], CreateStoryStore> = (set) => ({
  // Initial state
  title: "",
  characters: [],
  locations: "",
  locationId: 0,
  topic: "",
  topicId: 0,
  content: "",
  contentId: 0,
  timeContent: "",
  time: 0,

  // Actions
  setStoryTitle: (value) => set({ title: value }),
  setStoryCharacters: (value) =>
    set((state) => {
      const exists = state.characters.includes(value)
      return {
        characters: exists
          ? state.characters.filter((char) => char !== value)
          : [...state.characters, value],
      }
    }),
  setStoryLocations: (value) => set({ locations: value }),
  setLocationId: (value) => set({ locationId: value }),
  setStoryTopic: (value) => set({ topic: value }),
  setTopicId: (value) => set({ topicId: value }),
  setStoryContent: (value) => set({ content: value }),
  setContentId: (value) => set({ contentId: value }),
  setStoryTimeContent: (value) => set({ timeContent: value }),
  setStoryTime: (value) => set({ time: value }),
  resetStore: () =>
    set({
      title: "",
      characters: [],
      locations: "",
      locationId: 0,
      topic: "",
      topicId: 0,
      content: "",
      contentId: 0,
      timeContent: "",
      time: 0,
    }),

  // Add new delete actions
  deleteStoryCharacters: () => set({ characters: [], locationId: 0 }),
  deleteStoryLocations: () => set({ locations: "", locationId: 0 }),
  deleteStoryTopic: () => set({ topic: "", topicId: 0 }),
  deleteStoryContent: () => set({ content: "", contentId: 0 }),
  deleteStoryTime: () => set({ timeContent: "", time: 0 }),
})

export const createStoryStoreSelector = (state: RootStore) => ({
  title: state.title,
  characters: state.characters,
  locations: state.locations,
  locationId: state.locationId,
  topic: state.topic,
  topicId: state.topicId,
  content: state.content,
  contentId: state.contentId,
  timeContent: state.timeContent,
  time: state.time,
  setStoryTitle: state.setStoryTitle,
  setStoryCharacters: state.setStoryCharacters,
  setStoryLocations: state.setStoryLocations,
  setLocationId: state.setLocationId,
  setStoryTopic: state.setStoryTopic,
  setTopicId: state.setTopicId,
  setStoryContent: state.setStoryContent,
  setContentId: state.setContentId,
  setStoryTimeContent: state.setStoryTimeContent,
  setStoryTime: state.setStoryTime,
  resetStore: state.resetStore,

  // Add new delete selectors
  deleteStoryCharacters: state.deleteStoryCharacters,
  deleteStoryLocations: state.deleteStoryLocations,
  deleteStoryTopic: state.deleteStoryTopic,
  deleteStoryContent: state.deleteStoryContent,
  deleteStoryTime: state.deleteStoryTime,
})
