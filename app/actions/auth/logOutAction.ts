import { cookieStore, apiRequest } from '../shared';
import { redirect } from 'next/navigation';

export async function logoutUserAction(): Promise<void> {
  const token = cookieStore.get('token');

  if (token) {
    try {
      await apiRequest<void>('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }
  }

  // Always delete the token cookie
  cookieStore.delete('token');


  // Redirect to home page
  redirect('/');
}