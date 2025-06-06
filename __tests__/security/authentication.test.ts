import { validateSession, generateToken, verifyToken } from '@/lib/utils/auth';

describe('Authentication', () => {
  describe('Session Validation', () => {
    it('validates active sessions', () => {
      const validSession = {
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        userId: '123'
      };
      
      expect(validateSession(validSession)).toBe(true);
    });

    it('rejects expired sessions', () => {
      const expiredSession = {
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 3600000).toISOString(),
        userId: '123'
      };
      
      expect(validateSession(expiredSession)).toBe(false);
    });

    it('rejects invalid session formats', () => {
      expect(validateSession(null)).toBe(false);
      expect(validateSession({})).toBe(false);
      expect(validateSession({ token: 'only-token' })).toBe(false);
    });

    it('handles session timeout', () => {
      const session = {
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 1000).toISOString(),
        userId: '123'
      };
      
      expect(validateSession(session)).toBe(true);
      
      // Wait for session to expire
      return new Promise(resolve => {
        setTimeout(() => {
          expect(validateSession(session)).toBe(false);
          resolve(true);
        }, 1100);
      });
    });
  });

  describe('Token Management', () => {
    it('generates valid tokens', () => {
      const token = generateToken({ userId: '123', role: 'user' });
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('verifies valid tokens', () => {
      const payload = { userId: '123', role: 'user' };
      const token = generateToken(payload);
      const verified = verifyToken(token);
      
      expect(verified).toBeTruthy();
      expect(verified.userId).toBe(payload.userId);
      expect(verified.role).toBe(payload.role);
    });

    it('rejects tampered tokens', () => {
      const token = generateToken({ userId: '123', role: 'user' });
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      
      expect(() => verifyToken(tamperedToken)).toThrow();
    });

    it('rejects expired tokens', () => {
      const token = generateToken({ userId: '123', role: 'user' }, '1ms');
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(() => verifyToken(token)).toThrow();
          resolve(true);
        }, 2);
      });
    });
  });
});