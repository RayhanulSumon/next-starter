import { useAuthStore } from "../store/auth-store";

/**
 * Auth hook using Zustand store
 * @returns Zustand auth store state and actions
 */
export const useAuth = () => useAuthStore();
