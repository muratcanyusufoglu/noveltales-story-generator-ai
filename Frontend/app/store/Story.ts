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

export interface PaginatedResponse<T> {
  items: T[]
  currentPage: number
  totalPages: number
  totalItems: number
}
