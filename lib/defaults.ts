// Centralized defaults for images and other values

export const DEFAULT_AVATAR_URL = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
export const DEFAULT_BANNER_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

/**
 * Validates if a string is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Remove whitespace
  url = url.trim();
  
  // Check if it's empty after trimming
  if (!url) return false;
  
  // Check if it's a valid URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // If it's a relative path starting with /, it's valid
    return url.startsWith('/');
  }
}

/**
 * Returns the value if it is a valid image URL, otherwise returns the fallback.
 */
export function withDefault<T>(value: T | undefined | null, fallback: T): T {
  return value ?? fallback;
}

/**
 * Returns a valid image URL or the fallback if the provided URL is invalid
 */
export function withValidImageUrl(url: string | undefined | null, fallback: string): string {
  if (!url || typeof url !== 'string') return fallback;
  
  // Remove whitespace
  url = url.trim();
  
  // Check if it's empty after trimming
  if (!url) return fallback;
  
  // Check if it's a valid image URL
  if (isValidImageUrl(url)) {
    return url;
  }
  
  return fallback;
} 