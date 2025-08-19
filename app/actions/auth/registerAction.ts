'use server';
import { revalidatePath } from 'next/cache';
import { API_URL, ApiError } from '../shared';
import type { RegisterData, User } from '@/types/auth';
import { cookieStore, apiRequest } from '../shared';

export async function registerAction(data: RegisterData): Promise<User> {
  try {
    const result = await apiRequest<{ message: string; data: { token: string; user: User } }>('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Type guard for register response
    function isRegisterResponse(data: unknown): data is { token: string; user: User } {
      return (
        typeof data === "object" &&
        data !== null &&
        Object.prototype.hasOwnProperty.call(data, "token") &&
        Object.prototype.hasOwnProperty.call(data, "user")
      );
    }

    if (!isRegisterResponse(result.data)) {
      throw new ApiError(
        'Unexpected register response from /register.\n' +
        'Payload: ' + JSON.stringify(data) + '\n' +
        'Response: ' + JSON.stringify(result) + '\n' +
        'This usually means the backend is not returning the expected structure. Please check your backend API.',
        500,
        result
      );
    }

    await cookieStore.set('token', result.data.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    revalidatePath('/user/dashboard');
    return result.data.user;
  } catch (error) {
    if (
      error instanceof Error && (
        error.message.includes('Network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('ECONNREFUSED')
      )
    ) {
      throw new ApiError(
        'Unable to connect to the server. Please try again later.',
        0,
        { message: error.message }
      );
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Registration failed',
      500,
      {}
    );
  }
}