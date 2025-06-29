// import DOMPurify from 'isomorphic-dompurify'; // Moved to sanitization.ts
import { z } from 'zod';

// Input validation and sanitization - moved to sanitization.ts
// export const sanitizeInput = (input: string | null | undefined): string => { ... };

// Validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
  userId: z.string().uuid('Invalid user ID'),
  courseId: z.string().uuid('Invalid course ID'),
});

// Rate limiting
const rateLimits = new Map<string, number[]>();

export const checkRateLimit = (
  key: string,
  limit: number = 100,
  window: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const userRequests = rateLimits.get(key) || [];
  
  // Remove expired timestamps
  const validRequests = userRequests.filter(timestamp => now - timestamp < window);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimits.set(key, validRequests);
  
  return true;
};

// Error handling
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return userSchema.shape.email.safeParse(email).success;
}

export function validatePassword(password: string): boolean {
  return userSchema.shape.password.safeParse(password).success;
}

export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove script tags but keep their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
    return match.replace(/<[^>]*>/g, '');
  });
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/g, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/g, '');
  
  // Remove dangerous protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Handle SQL injection attempts
  sanitized = sanitized.replace(/';.*?--/g, '');
  sanitized = sanitized.replace(/';.*?;/g, '');
  
  // Remove any remaining potentially dangerous attributes
  sanitized = sanitized.replace(/<[^>]*(?:on\w+="[^"]*"|on\w+='[^']*')[^>]*>/g, (match) => {
    return match.replace(/\s+(?:on\w+="[^"]*"|on\w+='[^']*')/g, '');
  });
  
  return sanitized;
}