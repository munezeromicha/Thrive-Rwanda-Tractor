// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    removeAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}