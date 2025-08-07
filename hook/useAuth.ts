import { useContext } from 'react';
import AuthContext from '../context/auth-context';
import type { AuthContextType } from '@/types/auth';

/**
 * Enhanced auth hook with proper typing and error handling
 * @returns The auth context with all authentication methods and states
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context as AuthContextType & {
    loginLoading: boolean;
    registerLoading: boolean;
    resetLoading: boolean;
    requestResetLoading: boolean;
  };
};