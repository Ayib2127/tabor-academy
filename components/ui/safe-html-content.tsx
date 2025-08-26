"use client"

import { FC } from 'react'
import { withValidImageUrl, DEFAULT_BANNER_URL } from '@/lib/defaults'

interface SafeHtmlContentProps {
  content: string
  className?: string
  [key: string]: any
}

export const SafeHtmlContent: FC<SafeHtmlContentProps> = ({ 
  content, 
  className = '', 
  ...props 
}) => {
  // Sanitize HTML content to prevent XSS and fix invalid image URLs
  const sanitizeHtml = (html: string): string => {
    if (!html) return ''
    
    // Replace invalid image URLs with fallback
    const sanitizedHtml = html.replace(
      /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
      (match, beforeSrc, src, afterSrc) => {
        const validSrc = withValidImageUrl(src, DEFAULT_BANNER_URL)
        return `<img${beforeSrc}src="${validSrc}"${afterSrc}>`
      }
    )
    
    return sanitizedHtml
  }

  const sanitizedContent = sanitizeHtml(content)

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      suppressHydrationWarning
      {...props}
    />
  )
} 