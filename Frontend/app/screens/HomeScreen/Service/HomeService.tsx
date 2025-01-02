import { Api } from "../../../services/api"
import { PaginationParams, Story } from "../../../store/Story"

export default class HomeService {
  api: Api

  constructor() {
    this.api = new Api()
  }

  async getStories({ id, page = 1, limit = 10 }: { id: number } & PaginationParams) {
    try {
      console.log("HomeService: Fetching stories for user:", id)
      const response = await this.api.getUserStories(id, { page, limit })
      console.log("HomeService: API response:", response)

      if (response.kind === "ok" && response.data) {
        const { stories = [], currentPage = page, totalPages = 1, totalItems = 0 } = response.data
        console.log("HomeService: Processed response:", {
          stories,
          currentPage,
          totalPages,
          totalItems,
        })
        return {
          items: stories.map((story: Story) => ({
            ...story,
            isEditable: true,
          })),
          currentPage,
          totalPages,
          totalItems,
        }
      }
      console.log("HomeService: Invalid response or error")
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    } catch (error) {
      console.error("HomeService: Error fetching stories:", error)
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    }
  }

  async getStoriesByCategory(categoryId: number, { page = 1, limit = 10 }: PaginationParams) {
    try {
      console.log("HomeService: Fetching stories for category:", categoryId)
      const response = await this.api.getCategoryStories(categoryId, { page, limit })
      console.log("HomeService: Category API response:", response)

      if (response.kind === "ok" && response.data) {
        const { stories = [], currentPage = page, totalPages = 1, totalItems = 0 } = response.data
        console.log("HomeService: Processed category response:", {
          stories,
          currentPage,
          totalPages,
          totalItems,
        })
        return {
          items: stories.map((story: Story) => ({
            ...story,
            isEditable: false,
          })),
          currentPage,
          totalPages,
          totalItems,
        }
      }
      console.log("HomeService: Invalid category response or error")
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    } catch (error) {
      console.error("HomeService: Error fetching category stories:", error)
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    }
  }

  async getTopics() {
    try {
      console.log("HomeService: Fetching topics")
      const response = await this.api.apisauce.get("/topics")
      console.log("HomeService: Topics response:", response)
      if (response.ok && response.data) {
        return response.data || []
      }
      console.log("HomeService: Invalid topics response or error")
      return []
    } catch (error) {
      console.error("HomeService: Error fetching topics:", error)
      return []
    }
  }

  async continueStory({ id, generatedContent }: { id: number; generatedContent: string }) {
    try {
      const response = await this.api.continueStory(id, generatedContent)
      if (response.kind === "ok" && response.data) {
        return response.data
      }
      throw new Error("Failed to continue story")
    } catch (error) {
      console.error("Error continuing story:", error)
      throw error
    }
  }
}
