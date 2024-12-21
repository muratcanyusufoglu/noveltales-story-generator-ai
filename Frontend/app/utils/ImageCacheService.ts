import { Image } from "react-native"

class ImageCacheService {
  private static instance: ImageCacheService
  private cache: { [key: string]: boolean } = {}

  static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService()
    }
    return ImageCacheService.instance
  }

  async prefetchImage(uri: string): Promise<void> {
    if (this.cache[uri]) return

    try {
      await Image.prefetch(uri)
      this.cache[uri] = true
    } catch (error) {
      console.error("Error prefetching image:", error)
    }
  }

  async prefetchImages(uris: string[]): Promise<void> {
    const uniqueUris = [...new Set(uris)].filter((uri) => !this.cache[uri])
    await Promise.all(uniqueUris.map((uri) => this.prefetchImage(uri)))
  }

  isCached(uri: string): boolean {
    return !!this.cache[uri]
  }
}

export default ImageCacheService.getInstance()
