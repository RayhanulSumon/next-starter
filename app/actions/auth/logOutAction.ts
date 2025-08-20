"use server";
import { cookieStore } from "../shared";
import { redirect } from "next/navigation";
import { apiFetch, ApiClientResponse } from '@/lib/apiClient';

export async function logoutUserAction(): Promise<ApiClientResponse<void>> {
  const token = await cookieStore.get('token');
  try {
    if (token) {
      try {
        await apiFetch<void>('/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API error:', error);
      }
    }
    await cookieStore.delete('token');
    redirect('/');
    return {
      message: 'Logged out successfully',
      data: undefined,
      errors: [],
      status: 200,
    };
  } catch (error) {
    throw {
      message: 'Logout failed',
      data: undefined,
      errors: [],
      status: 500,
    };
  }
}