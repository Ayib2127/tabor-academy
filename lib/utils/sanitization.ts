import DOMPurify from 'isomorphic-dompurify';

// Input validation and sanitization
export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return '';
  
  // Use DOMPurify to remove XSS vectors
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  });

  // Remove SQL injection patterns
  return clean.replace(/['";]/g, '');
}; 