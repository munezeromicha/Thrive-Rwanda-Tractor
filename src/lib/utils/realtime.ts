import { NextResponse } from 'next/server';

export async function fetchRealtimeData<T>(
  fetchFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 5000
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const result = await fetchFn();
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to fetch data after multiple attempts');
}

export function createRealtimeResponse<T>(data: T) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  });
} 