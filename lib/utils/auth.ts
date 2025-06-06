import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface Session {
  token: string;
  expiresAt: string;
  userId: string;
}

interface TokenPayload {
  userId: string;
  role: string;
}

export const validateSession = (session: Session | null): boolean => {
  if (!session?.token || !session?.expiresAt || !session?.userId) {
    return false;
  }

  const expiresAt = new Date(session.expiresAt).getTime();
  return expiresAt > Date.now();
};

export const generateToken = (payload: TokenPayload, expiresIn: string = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const userRoles = {
  admin: ['read', 'write', 'delete'],
  instructor: ['read', 'write'],
  student: ['read']
};

export const checkPermissions = (role: string, requiredPermissions: string | string[]): boolean => {
  const permissions = userRoles[role as keyof typeof userRoles];
  if (!permissions) return false;

  if (Array.isArray(requiredPermissions)) {
    return requiredPermissions.every(p => permissions.includes(p));
  }
  return permissions.includes(requiredPermissions);
};

export const validateRole = (role: string, requiredRole?: string): boolean => {
  const validRoles = ['admin', 'instructor', 'student'];
  if (!validRoles.includes(role)) return false;
  
  if (requiredRole) {
    const roleIndex = validRoles.indexOf(role);
    const requiredIndex = validRoles.indexOf(requiredRole);
    return roleIndex <= requiredIndex;
  }
  
  return true;
};

const rateLimits = new Map<string, number[]>();

export const enforceRateLimit = async (
  userId: string,
  limit: number = 5,
  window: number = 1000
): Promise<boolean> => {
  if (!userId) return false;

  const now = Date.now();
  const userRequests = rateLimits.get(userId) || [];
  
  // Remove expired timestamps
  const validRequests = userRequests.filter(timestamp => now - timestamp < window);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimits.set(userId, validRequests);
  
  return true;
};