import { sanitizeInput, validateEmail, validatePassword } from '@/lib/utils/security';

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('removes XSS attack vectors', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      expect(sanitizeInput(maliciousInput)).toBe('alert("xss")');
      
      const maliciousHtml = '<img src="x" onerror="alert(1)">';
      expect(sanitizeInput(maliciousHtml)).toBe('<img src="x">');
    });

    it('preserves valid HTML tags', () => {
      const validHtml = '<p>Hello</p> <strong>World</strong>';
      expect(sanitizeInput(validHtml)).toBe('<p>Hello</p> <strong>World</strong>');
    });

    it('handles SQL injection attempts', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      expect(sanitizeInput(sqlInjection)).toBe('DROP TABLE users');
    });

    it('handles null and undefined inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.')).toBe(false);
    });

    it('handles null and undefined inputs', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      expect(validatePassword('StrongP@ss123')).toBe(true);
      expect(validatePassword('C0mpl3x!P@ssw0rd')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('abcdefgh')).toBe(false);
    });

    it('enforces minimum length', () => {
      expect(validatePassword('Sh0rt!')).toBe(false);
    });

    it('requires mixed case, numbers, and special characters', () => {
      expect(validatePassword('onlylowercase123!')).toBe(false);
      expect(validatePassword('ONLYUPPERCASE123!')).toBe(false);
      expect(validatePassword('NoSpecialChars123')).toBe(false);
      expect(validatePassword('NoNumbers!@#$%')).toBe(false);
    });
  });
});