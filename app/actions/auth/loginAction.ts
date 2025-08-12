'use server';
import { revalidatePath } from 'next/cache';
import { API_URL, ApiError, CookieOptions } from '../shared';
import type { User } from '@/types/auth';
import { cookieStore, apiRequest } from '../shared';

export async function loginAction(identifier: string, password: string): Promise<User> {
  try {
    const data = await apiRequest<{ token: string; user: User }>('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    cookieStore.set('token', data.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    revalidatePath('/user/dashboard');
    return data.user;
  } catch (error) {
    const apiError = error instanceof ApiError
      ? error
      : new ApiError(
          error instanceof Error ? error.message : 'Login failed',
          500,
          {}
        );
    throw apiError;
  }
}