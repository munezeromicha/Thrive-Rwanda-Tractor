// src/lib/utils/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { getUser } from '@/actions/user';

// Configure runtime for auth utils
export const runtime = 'nodejs';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'Thrive-Rwanda-2025';

// Token expiration (24 hours)
const TOKEN_EXPIRATION = '24h';

// Interface for JWT payload
export interface JWTPayload {
  jti: string;
  iat: number;
  exp: number;
  sub: string; // User ID
  email: string;
  role: string;
}

// Create a JWT token
export async function createToken(payload: Omit<JWTPayload, 'jti' | 'iat' | 'exp'>) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(secretKey);
    
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Failed to create authentication token');
  }
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Set token in cookies
export function setAuthCookie(token: string) {
  cookies().set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'strict',
  });
}

// Remove token from cookies
export function removeAuthCookie() {
  cookies().set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'strict',
  });
}

// Get current user from token (server component only)
export async function getCurrentUser() {
  const token = cookies().get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  try {
    const user = await getUser(payload.sub);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is authenticated (server component only)
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Check if user is admin (server component only)
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}