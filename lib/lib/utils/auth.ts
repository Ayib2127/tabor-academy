import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface Session {
  token: string;
  expiresAt: string;
  userId: string;
}

interface TokenPayload {
  userId: string;
  role: string;
  [key: string]: any;
}

export function validateSession(session: Session | null | undefined): boolean {
  if (!session || typeof session !== 'object') {
    return false;
  }

  const { token, expiresAt, userId } = session;
  if (!token || !expiresAt || !userId) {
    return false;
  }

  const expirationTime = new Date(expiresAt).getTime();
  return expirationTime > Date.now();
}

export function generateToken(payload: TokenPayload, expiresIn: string = '24h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Permission and role helpers for tests
export function checkPermissions(role: string, permission: string | string[]): boolean {
  const roles: Record<string, string[]> = {
    admin: ['read', 'write', 'delete'],
    instructor: ['read', 'write'],
    student: ['read'],
  };
  const perms = roles[role] || [];
  if (Array.isArray(permission)) {
    return permission.every(p => perms.includes(p));
  }
  return perms.includes(permission);
}

export function validateRole(role: string, compareTo?: string): boolean {
  const validRoles = ['admin', 'instructor', 'student'];
  if (!role || !validRoles.includes(role)) return false;
  if (compareTo) {
    return validRoles.indexOf(role) <= validRoles.indexOf(compareTo);
  }
  return true;
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 5;
const WINDOW = 1000;

export async function enforceRateLimit(userId: string): Promise<boolean> {
  if (!userId) return false;
  const now = Date.now();
  const entry = rateLimitMap.get(userId) || { count: 0, timestamp: now };
  if (now - entry.timestamp > WINDOW) {
    rateLimitMap.set(userId, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count < LIMIT) {
    rateLimitMap.set(userId, { count: entry.count + 1, timestamp: entry.timestamp });
    return true;
  }
  return false;
}
