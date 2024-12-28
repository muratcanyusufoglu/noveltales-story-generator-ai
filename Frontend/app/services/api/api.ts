/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import { Episode } from "../../store/Episode"
import { PaginationParams, PaginatedResponse, Story } from "../../store/Story"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: "http://localhost:3000/api/",
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: Episode[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: Episode[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getStories(
    params?: PaginationParams,
  ): Promise<{ kind: "ok"; data: PaginatedResponse<Story> } | GeneralApiProblem> {
    try {
      const response = await this.apisauce.get("/stories", params)
      console.log("API getStories response:", response)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: response.data }
    } catch (e) {
      return { kind: "bad-data" }
    }
  }

  async getUserStories(
    userId: number,
    params?: PaginationParams,
  ): Promise<{ kind: "ok"; data: PaginatedResponse<Story> } | GeneralApiProblem> {
    try {
      const response = await this.apisauce.get(`/stories/user/${userId}`, { params })
      console.log("API getUserStories response:", response)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: response.data }
    } catch (e) {
      return { kind: "bad-data" }
    }
  }

  async getCategoryStories(
    categoryId: number,
    params?: PaginationParams,
  ): Promise<{ kind: "ok"; data: PaginatedResponse<Story> } | GeneralApiProblem> {
    try {
      const response = await this.apisauce.get(`/stories/category/${categoryId}`, { params })
      console.log("API getCategoryStories response:", response)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: response.data }
    } catch (e) {
      return { kind: "bad-data" }
    }
  }

  async continueStory(
    id: number,
    generatedContent: string,
  ): Promise<{ kind: "ok"; data: Story } | GeneralApiProblem> {
    try {
      const response = await this.apisauce.put(`/stories/${id}/continue`, {
        contentText: generatedContent,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: response.data }
    } catch (e) {
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
