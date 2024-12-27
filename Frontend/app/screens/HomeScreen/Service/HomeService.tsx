import { Api } from "../../../services/api"
import { PaginationParams } from "../../../store/Story"

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
        return {
          items: response.data.items || [],
          currentPage: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
        }
      }
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
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
        return {
          items: response.data.items || [],
          currentPage: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
        }
      }
      return {
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      }
    } catch (error) {
      console.error("Error fetching category stories:", error)
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
      const response = await this.api.apisauce.get("/topics")
      if (response.ok && response.data) {
        return response.data || []
      }
      return []
    } catch (error) {
      console.error("Error fetching topics:", error)
      return []
    }
  }
}
