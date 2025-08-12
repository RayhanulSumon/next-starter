'use server';
import { revalidatePath } from 'next/cache';
import { API_URL, ApiError, CookieOptions } from '../shared';
import type { RegisterData, User } from '@/types/auth';
import { cookieStore, apiRequest } from '../shared';

export async function registerAction(data: RegisterData): Promise<User> {
  try {
    const result = await apiRequest<{ token: string; user: User }>('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    cookieStore.set('token', result.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    revalidatePath('/user/dashboard');
    return result.user;
  } catch (error) {
    const apiError = error instanceof ApiError
      ? error
      : new ApiError(
          error instanceof Error ? error.message : 'Registration failed',
          500,
          {}
        );
    throw apiError;
  }
}