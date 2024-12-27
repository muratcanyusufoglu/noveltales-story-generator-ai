/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: Record<string, any>
  items: any[]
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

export interface PaginatedResponse<T> {
  items: T[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface Story {
  id: number
  userId: number
  characterIds: number[]
  characterNames: string[]
  topicId: number
  topicName: string
  timeLapse: string
  timeLapseTime: string
  content: string
  contentText: string
  locationId: number
  location: string
  generatedContent: string
  header: string
  storyImage: string
  isContinues: boolean
  totalPartCount: number
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}
