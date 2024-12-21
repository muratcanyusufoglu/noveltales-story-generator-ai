import React, { useState, useEffect } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { AutoImage, AutoImageProps } from "./AutoImage"
import { colors } from "../theme"
import ImageCacheService from "../utils/ImageCacheService"

interface CachedImageProps extends AutoImageProps {
  loadingComponent?: React.ReactElement
}

export function CachedImage({ loadingComponent, style, source, ...props }: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const uri = typeof source === "object" ? source.uri : undefined

  useEffect(() => {
    if (uri && !ImageCacheService.isCached(uri)) {
      ImageCacheService.prefetchImage(uri)
    }
  }, [uri])

  return (
    <View>
      <AutoImage
        {...props}
        source={source}
        style={style}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && !ImageCacheService.isCached(uri) && (
        <View style={[$loadingContainer, style]}>
          {loadingComponent || <ActivityIndicator color={colors.palette.primary500} />}
        </View>
      )}
    </View>
  )
}

const $loadingContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
}
