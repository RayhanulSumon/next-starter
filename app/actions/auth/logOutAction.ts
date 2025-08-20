"use server";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from '@/lib/apiClient';

export async function logoutUserAction(): Promise<ApiClientResponse<void>> {
  const token = await cookieStore.get('token');
  let apiErrorMessage: string | undefined = undefined;
  try {
    if (token) {
      try {
        await apiFetch<void>(
          '/logout',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
          'POST'
        );
      } catch (error: unknown) {
        apiErrorMessage = error instanceof Error ? error.message : 'API logout failed';
        console.error('Logout API error:', error);
      }
    }
    await cookieStore.delete('token');
    return {
      message: apiErrorMessage ? `Logged out (API: ${apiErrorMessage})` : 'Logged out successfully',
      data: undefined,
      errors: [],
      status: 200,
    };
  } catch (error: unknown) {
    return {
      message: 'Logout failed',
      data: undefined,
      errors: [error instanceof Error ? error.message : String(error)],
      status: 500,
    };
  }
}