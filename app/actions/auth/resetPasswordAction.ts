'use server';
import { ApiError, apiRequest } from '../shared';
import type { PasswordResetRequest, PasswordResetData, PasswordResetResponse } from '@/types/auth';

export async function requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
  return apiRequest<PasswordResetResponse>('/request-password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function resetPasswordAction(data: PasswordResetData): Promise<PasswordResetResponse> {
  try {
    return await apiRequest<PasswordResetResponse>('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(error.message, error.status, error.data);
    } else {
      throw new ApiError(
        error instanceof Error ? error.message : 'Password reset failed',
        500,
        {}
      );
    }
  }
}