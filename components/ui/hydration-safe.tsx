"use client"

import { ReactNode } from 'react'

interface HydrationSafeProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * A component that suppresses hydration warnings for content that might be modified by browser extensions
 * This is useful for elements that browser extensions commonly modify (like adding bis_skin_checked attributes)
 */
export function HydrationSafe({ children, className = "", as: Component = "div" }: HydrationSafeProps) {
  return (
    <Component className={className} suppressHydrationWarning>
      {children}
    </Component>
  )
} 