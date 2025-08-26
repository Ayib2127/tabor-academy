"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { withValidImageUrl, DEFAULT_BANNER_URL } from '@/lib/defaults'

interface SafeImageProps {
  src: string | undefined | null
  alt: string
  fallback?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  loading?: 'lazy' | 'eager'
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  [key: string]: any
}

export function SafeImage({
  src,
  alt,
  fallback = DEFAULT_BANNER_URL,
  className = '',
  onError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(() => withValidImageUrl(src, fallback))
  const [hasError, setHasError] = useState(false)

  // Update image when src prop changes
  useEffect(() => {
    const next = withValidImageUrl(src, fallback)
    setImgSrc(next)
    setHasError(false)
  }, [src, fallback])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallback)
    }
    
    if (onError) {
      onError(e)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  )
} 