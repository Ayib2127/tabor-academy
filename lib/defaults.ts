// Centralized defaults for images and other values

export const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/your-cloud/image/upload/v123/default-avatar.png";
export const DEFAULT_BANNER_URL = "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1752681843/default-banner_fuwa92.png";

/**
 * Returns the value if it is truthy, otherwise returns the fallback.
 */
export function withDefault<T>(value: T | undefined | null, fallback: T): T {
  return value ?? fallback;
} 