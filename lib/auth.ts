import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'radhey_radhey_secure_fallback_secret_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

export async function requireAuth(roles: string[] = []) {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, error: 'Unauthorized', status: 401 };
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { user: null, error: 'Forbidden: Insufficient privileges', status: 403 };
  }
  return { user, error: null, status: 200 };
}
